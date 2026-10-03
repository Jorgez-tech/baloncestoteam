const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const User = require('../../../../models/user.model');
const PasswordResetToken = require('../../../../models/password_reset_token.model');


// Asumiendo que redis está configurado. Si falla, el servicio debe manejarlo o no usar Redis para refresh en este mock
const redisClient = require('../../../../config/redis');

class AuthService {
    getJwtSecret() {
        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET no definido en variables de entorno');
        }
        return process.env.JWT_SECRET;
    }

    getRefreshSecret() {
        return process.env.JWT_REFRESH_SECRET || this.getJwtSecret() + '_refresh';
    }

    async register(data) {
        const existing = await User.findOne({ email: data.email });
        if (existing) {
            throw new Error('Email already registered');
        }
        const user = new User(data);
        await user.save();
        return user;
    }

    async login(email, password) {
        const user = await User.findOne({ email });
        if (!user) throw new Error('Invalid credentials');
        
        if (!user.isActive) throw new Error('Account disabled');

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw new Error('Invalid credentials');

        return this.generateTokens(user);
    }

    async generateTokens(user) {
        const payload = {
            id: user._id,
            role: user.role,
            email: user.email,
        };

        const accessToken = jwt.sign(payload, this.getJwtSecret(), { expiresIn: '15m' });
        const refreshToken = jwt.sign(payload, this.getRefreshSecret(), { expiresIn: '7d' });

        // Opcional: Almacenar refreshToken en Redis para blacklist / revocación
        // await redisClient.set(`refresh:${user._id}:${refreshToken}`, 'valid', 'EX', 7 * 24 * 60 * 60);

        return { accessToken, refreshToken, user: user.toJSON() };
    }

    async refreshTokens(oldRefreshToken) {
        try {
            const decoded = jwt.verify(oldRefreshToken, this.getRefreshSecret());
            const user = await User.findById(decoded.id);
            if (!user || !user.isActive) {
                throw new Error('User inactive or not found');
            }
            return this.generateTokens(user);
        } catch (error) {
            throw new Error('Invalid refresh token');
        }
    }

    async logout(refreshToken) {
        // En una implementación real con Redis, agregamos el refresh token a la blacklist
        if (refreshToken) {
            try {
                const decoded = jwt.verify(refreshToken, this.getRefreshSecret());
                if (redisClient && redisClient.status === 'ready') {
                    await redisClient.set(`bl_refresh:${decoded.id}:${refreshToken}`, 'revoked', 'EX', 7 * 24 * 60 * 60);
                }
            } catch (e) {
                // Ignore invalid tokens during logout
            }
        }
    }

    async forgotPassword(email, ip) {
        const user = await User.findOne({ email });
        if (!user || !user.isActive) return null; // No throw to avoid email enumeration

        // Generate 6 digit code
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        const codeHash = await bcrypt.hash(code, 10);

        await PasswordResetToken.deleteMany({ email }); // Borrar anteriores

        const token = new PasswordResetToken({
            userId: user._id,
            email,
            codeHash,
            ip
        });
        await token.save();

        // AQUÍ IRÍA LA INTEGRACIÓN CON MAILER: mailService.sendResetCode(email, code);
        // eslint-disable-next-line no-console
        console.log(`[DEV] CÓDIGO DE RESET PARA ${email}: ${code}`);
        return { code };
    }

    async verifyResetCode(email, code) {
        const token = await PasswordResetToken.findOne({ email, used: false });
        if (!token) throw new Error('Código inválido o expirado');

        if (token.failedAttempts >= 3) {
            await PasswordResetToken.deleteOne({ _id: token._id });
            throw new Error('Demasiados intentos fallidos. Solicita un nuevo código.');
        }

        const isMatch = await bcrypt.compare(code, token.codeHash);
        if (!isMatch) {
            token.failedAttempts += 1;
            await token.save();
            throw new Error('Código inválido');
        }

        const sessionToken = crypto.randomUUID();
        token.sessionToken = sessionToken;
        await token.save();

        return sessionToken;
    }

    async resetPassword(sessionToken, newPassword) {
        const token = await PasswordResetToken.findOne({ sessionToken, used: false });
        if (!token) throw new Error('Sesión inválida o expirada');

        const user = await User.findById(token.userId);
        if (!user) throw new Error('Usuario no encontrado');

        user.password = newPassword; // El pre-save hook de Mongoose hará el hash
        await user.save();

        token.used = true;
        await token.save();

        return user;
    }
}

module.exports = new AuthService();
