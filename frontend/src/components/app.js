import React from 'react';
import Header from './components/Header';
import Gallery from './components/Gallery';
import SignupForm from './components/SignupForm';
import Footer from './components/Footer';
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