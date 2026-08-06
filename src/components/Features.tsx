import hospitalImg from "../assets/services/hospital.png";
import bloodBankImg from "../assets/services/blood-bank.png";
import policeImg from "../assets/services/police.png";
import fireImg from "../assets/services/fire.png";
import womenImg from "../assets/services/women.png";
import childImg from "../assets/services/child.png";
import pawsImg from "../assets/services/paws.png";
import foodImg from "../assets/services/food.png";
import mechanicImg from "../assets/services/mechanic.png";
import shelterImg from "../assets/services/shelter.png";
import "./Features.css";
import { findNearby } from "../utils/findNearby";

const Features = () => {

  return (
    <section className="services" id="services">
      <h2 className="services-title">Emergency Services</h2>
      <div className="services-heart">♥</div>

      {/* Emergency */}
      <div className="services-group">
        <h3 className="group-label">Emergency</h3>
        <div className="services-grid grid-4">
          <div className="service-card" onClick={() => findNearby("hospitals near me")}>
            <div className="icon-circle"><img src={hospitalImg} alt="Hospital" /></div>
            <h4>Hospital</h4>
            <p>Find nearby hospitals and ambulance support</p>
            <span className="arrow">→</span>
          </div>
          <div className="service-card" onClick={() => findNearby("blood banks near me")}>
            <div className="icon-circle"><img src={bloodBankImg} alt="Blood Bank" /></div>
            <h4>Blood Bank</h4>
            <p>Locate blood banks and available donors</p>
            <span className="arrow">→</span>
          </div>
          <div className="service-card" onClick={() => findNearby("police stations near me")}>
            <div className="icon-circle"><img src={policeImg} alt="Police" /></div>
            <h4>Police</h4>
            <p>Connect with local police stations</p>
            <span className="arrow">→</span>
          </div>
          <div className="service-card" onClick={() => findNearby("fire stations near me")}>
            <div className="icon-circle"><img src={fireImg} alt="Fire Station" /></div>
            <h4>Fire Station</h4>
            <p>Get fire assistance and emergency help</p>
            <span className="arrow">→</span>
          </div>
        </div>
      </div>

      {/* Safety */}
      <div className="services-group">
        <h3 className="group-label">Safety</h3>
        <div className="services-grid grid-2">
          <div className="service-card">
            <div className="icon-circle"><img src={womenImg} alt="Women Safety" /></div>
            <h4>Women Safety</h4>
            <p>Resources and helplines for women safety</p>
            <span className="arrow">→</span>
          </div>
          <div className="service-card">
            <div className="icon-circle"><img src={childImg} alt="Child Safety" /></div>
            <h4>Child Safety</h4>
            <p>Support and protection for children</p>
            <span className="arrow">→</span>
          </div>
        </div>
      </div>

      {/* Support */}
      <div className="services-group">
        <h3 className="group-label">Support</h3>
        <div className="services-grid grid-4">
          <div className="service-card">
            <div className="icon-circle"><img src={pawsImg} alt="Animal Rescue" /></div>
            <h4>Animal Rescue</h4>
            <p>Find animal rescue services near you</p>
            <span className="arrow">→</span>
          </div>
          <div className="service-card">
            <div className="icon-circle"><img src={foodImg} alt="Food Support" /></div>
            <h4>Food Support</h4>
            <p>Access food banks and meal support</p>
            <span className="arrow">→</span>
          </div>
          <div className="service-card">
            <div className="icon-circle"><img src={mechanicImg} alt="Mechanics" /></div>
            <h4>Mechanics</h4>
            <p>Get roadside assistance and mechanic help</p>
            <span className="arrow">→</span>
          </div>
          <div className="service-card">
            <div className="icon-circle"><img src={shelterImg} alt="Shelters" /></div>
            <h4>Shelters</h4>
            <p>Find shelters and temporary housing</p>
            <span className="arrow">→</span>
          </div>
        </div>
      </div>

      {/* Bottom banner */}
      <div className="services-banner">
        <div className="banner-left">
          <span className="banner-heart">♥</span>
          <span className="arrow-small">→</span>
          <div>
            <strong>We're here to help, every step of the way.</strong>
            <p>Because humanity connects us all.</p>
          </div>
        </div>
        <button className="btn-primary">Get Help Now <span>→</span></button>
      </div>
    </section>
  );
};

export default Features;

