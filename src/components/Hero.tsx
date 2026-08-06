import careimage from "../assets/hero/care.png";
import "./Hero.css";

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-left">
        <h1>
          One Platform. <br />
          For Every Emergency.
        </h1>
        <p className="hero-subtext">Fast • Verified • Nearby</p>
        <p className="hero-desc">
          HumanGrid connects you to the right help in the right time.
        </p>

        <div className="hero-buttons">
          <button className="btn-primary">
            Get Help Now <span>&rarr;</span>
          </button>
          <button
  className="btn-primary"
  onClick={() =>
    document
      .getElementById("services")
      ?.scrollIntoView({ behavior: "smooth" })
  }
>
  Get Help Now
</button>
        </div>

        <div className="hero-trust">
          <div className="trust-avatars">
            <span className="avatar"></span>
            <span className="avatar"></span>
            <span className="avatar"></span>
            <span className="avatar"></span>
          </div>
          <p>
            Trusted by 10,000+ people <br /> across the country
          </p>
        </div>
      </div>

      <div className="hero-right">
        <img src={careimage} alt="HumanGrid Care" className="care-img" style={{ width: "240px", height: "auto" }} />

        <div className="support-card">
          <span className="support-icon">🎧</span>
          <div>
            <strong>24/7 Support</strong>
            <p>We're always here when you need us</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;