import React from 'react';
import Header from './Header';
import Gallery from './Gallery';
import SignupForm from './signupform';
import Footer from './footer';
import './index.css';

const App = () => (
    <div>
        <Header />
        <main>
            <Gallery />
            <SignupForm />
        </main>
        <Footer />
    </div>
);

export default App;