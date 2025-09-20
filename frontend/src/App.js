function App() {
    return (
        <div className="hero_area">
            {/* Header Section */}
            <header className="header_section">
                <div className="container-fluid">
                    <nav className="navbar navbar-expand-lg custom_nav-container">
                        <a className="navbar-brand" href="index.html">
                            <span>Sportpar</span>
                        </a>
                        <button
                            className="navbar-toggler"
                            type="button"
                            data-toggle="collapse"
                            data-target="#navbarSupportedContent"
                            aria-controls="navbarSupportedContent"
                            aria-expanded="false"
                            aria-label="Toggle navigation"
                        >
                            <span className="navbar-toggler-icon"></span>
                        </button>

                        <div className="collapse navbar-collapse" id="navbarSupportedContent">
                            <div className="d-flex ml-auto flex-column flex-lg-row align-items-center">
                                <ul className="navbar-nav">
                                    <li className="nav-item active">
                                        <a className="nav-link" href="index.html">
                                            Home <span className="sr-only">(current)</span>
                                        </a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link" href="about.html">About</a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link" href="product.html">Products</a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link" href="contact.html">Contact us</a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link" href="#">Login</a>
                                    </li>
                                </ul>
                                <div className="quote_btn-container">
                                    <a href="" className="cart_link">
                                        <i className="fa fa-cart-arrow-down" aria-hidden="true"></i>
                                        <span className="cart_number">0</span>
                                    </a>
                                    <form className="form-inline">
                                        <button className="btn nav_search-btn" type="submit">
                                            <i className="fa fa-search" aria-hidden="true"></i>
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </nav>
                </div>
            </header>
            {/* End Header Section */}

            {/* Slider Section */}
            <section className="slider_section position-relative">
                <ol className="carousel-indicators indicator-2">
                    <li data-target="#carouselExampleIndicators" data-slide-to="0" className="active indicator-li-1">
                        01
                    </li>
                    <li data-target="#carouselExampleIndicators" data-slide-to="1">
                        02
                    </li>
                    <li data-target="#carouselExampleIndicators" data-slide-to="2">
                        03
                    </li>
                </ol>
                <div className="container-fluid h-100">
                    <div className="row">
                        <div className="col-md-5 col-xl-4 offset-xl-1">
                            <div className="detail-box">
                                <h1>
                                    Sports and <br /> Fitness Store
                                </h1>
                                <p>There are many variations of passages of Lorem Ipsum available.</p>
                                <div className="btn-box">
                                    <a href="" className="btn-1">
                                        Shop Now
                                    </a>
                                    <a href="" className="btn-2">
                                        Get A Quote
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-7 px-0 h-100">
                            <div className="img_container h-100">
                                <div id="carouselExampleIndicators" className="carousel slide carousel-fade" data-ride="carousel">
                                    <ol className="carousel-indicators indicator-1">
                                        <li data-target="#carouselExampleIndicators" data-slide-to="0" className="active indicator-li-1"></li>
                                        <li data-target="#carouselExampleIndicators" data-slide-to="1"></li>
                                        <li data-target="#carouselExampleIndicators" data-slide-to="2"></li>
                                    </ol>
                                    <div className="carousel-inner">
                                        <div className="carousel-item active">
                                            <div className="img-box">
                                                <img src="images/slider-img.jpg" alt="" />
                                            </div>
                                        </div>
                                        <div className="carousel-item">
                                            <div className="img-box">
                                                <img src="images/slider-img2.jpg" alt="" />
                                            </div>
                                        </div>
                                        <div className="carousel-item">
                                            <div className="img-box">
                                                <img src="images/slider-img3.jpg" alt="" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* End Slider Section */}
        </div>
    );
}

export default App;