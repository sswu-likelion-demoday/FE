import "./ProgressBar.scss";

const ProgressBar = ({ currentStep = 1, totalSteps = 5 }) => {
  return (
    <div className="ProgressBar_wrap">
      {Array.from({ length: totalSteps }, (_, index) => (
        <div
          key={index}
          className={`progress_step ${index < currentStep ? "active" : ""}`}
        />
      ))}
    </div>
  );
};

export default ProgressBar;
