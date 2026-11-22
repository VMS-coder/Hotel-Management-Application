
function Home() {
  return (
    <>
      {/* Hero Section */}
      <div className="container-fluid bg-dark text-white text-center py-5">
        <h1 className="display-4 fw-bold">
          Welcome to HotelPro
        </h1>

        <p className="lead">
          Find your perfect stay with comfort and luxury.
        </p>

        <button className="btn btn-warning btn-lg mt-3">
          Explore Rooms
        </button>
      </div>

      {/* About Section */}
      <div className="container my-5">
        <h2 className="text-center mb-4">
          Why Choose HotelPro?
        </h2>

        <div className="row text-center">
          <div className="col-md-4 mb-3">
            <h4>Comfortable Rooms</h4>
            <p>Enjoy luxurious and comfortable rooms.</p>
          </div>

          <div className="col-md-4 mb-3">
            <h4>Best Prices</h4>
            <p>Get the best deals for your stay.</p>
          </div>

          <div className="col-md-4 mb-3">
            <h4>Easy Booking</h4>
            <p>Book your favourite room easily.</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
