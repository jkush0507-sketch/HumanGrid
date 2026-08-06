import "./HowItWorks.css";

const steps = [
  {
    number: "01",
    title: "Raise an Alert",
    description:
      "Press the SOS button or select the service you need.",
  },
  {
    number: "02",
    title: "Locate Nearby Help",
    description:
      "HumanGrid finds hospitals, volunteers, police stations, and support centres nearby.",
  },
  {
    number: "03",
    title: "Connect Instantly",
    description:
      "Get immediate assistance through verified networks and emergency services.",
  },
];

const HowItWorks = () => {
  return (
    <section className="how-it-works" id="how-it-works">
      <div className="section-header">
        <h2>How HumanGrid Works</h2>
        <p>
          Fast, verified, and reliable support whenever you need it.
        </p>
      </div>

      <div className="steps-container">
        {steps.map((step) => (
          <div className="step-card" key={step.number}>
            <span className="step-number">{step.number}</span>

            <h3>{step.title}</h3>

            <p>{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;