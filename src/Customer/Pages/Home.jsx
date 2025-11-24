import React from "react";
import Navbar from "../Components/Navbar.jsx";
import cafeAmbience from "../../assets/Carousel Image.png";
import Footer from "../Components/Footer.jsx";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <div className="px-4 mt-6 text-center">
        <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold">
          Welcome to Iman Cafe
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl text-gray-600 mt-4">
          Experience the{" "}
          <span className="text-red-500 font-bold">Best of the Best</span> with us
        </p>

        {/* Image */}
        <div className="flex justify-center mt-8">
          <img
            src={cafeAmbience}
            alt="Cafe Ambience"
            className="w-full sm:w-4/5 md:w-3/4 rounded-lg shadow-lg"
          />
        </div>
      </div>

      {/* About Section */}
      <section className="max-w-4xl mx-auto mt-10 px-4">
        <div className="bg-white rounded-lg shadow-md p-6 sm:p-8">
          <h2 className="text-2xl font-semibold mb-4 text-center">
            About Iman Cafe
          </h2>
          <p className="text-gray-700 leading-relaxed text-center text-sm sm:text-base">
            At Iman Cafe, we believe in serving more than just food and drinks.
            We offer an experience that delights all your senses. From the aroma
            of freshly brewed coffee to the cozy ambiance, every detail is
            crafted to make you feel at home. Our menu features gourmet dishes
            and artisanal beverages made from the finest ingredients. Whether
            you're here for a quick bite or a leisurely meal, we promise to make
            your visit memorable.
          </p>
        </div>

        <div className="text-center mt-8 mb-10">
          <Link
            to="/Menu"
            className="bg-amber-700 text-white px-6 py-3 rounded-lg hover:bg-amber-800 transition shadow-md font-semibold text-base sm:text-lg"
          >
            Explore Our Menu
          </Link>
        </div>
      </section>

      {/* Reviews */}
      <section className="max-w-4xl mx-auto px-4 mb-14">
        <div className="bg-white rounded-lg shadow-md p-6 sm:p-8">
          <h2 className="text-2xl font-semibold mb-4 text-center">
            Customer Reviews
          </h2>
          <div className="space-y-4">
            <div className="border-b pb-4">
              <p className="text-gray-700 text-sm sm:text-base">
                <strong>John Doe:</strong> "The ambiance is amazing and the
                coffee is the best I've ever had!"
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
