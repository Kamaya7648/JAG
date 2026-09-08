import "./WelcomeGreeting.css";
import { useEffect, useRef } from "react";
import { useApp } from "../../context/AppContext";

const SESSION_KEY = "gms_welcome_greeting_shown";

function WelcomeGreeting({ onFinish }) {
  const { user } = useApp();
  const startedRef = useRef(false);

  const hour = new Date().getHours();
  let greetingPhrase = "Good Morning";

  if (hour >= 12 && hour < 17) {
    greetingPhrase = "Good Afternoon";
  } else if (hour >= 17) {
    greetingPhrase = "Good Evening";
  }

  const firstName = (user?.name || "there").split(" ")[0];

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    sessionStorage.setItem(SESSION_KEY, "true");
  }, []);

  return (
    <div
      className="welcome-splash"
      onAnimationEnd={(e) => {
        if (e.animationName === "welcomeSplashFadeOut") {
          onFinish();
        }
      }}
    >
      <div className="welcome-glow" />

      <div className="welcome-content">
        <h1 className="welcome-text">
          {greetingPhrase}, <span className="welcome-name">{firstName}</span>
        </h1>
        <div className="welcome-underline" />
      </div>
    </div>
  );
}

export default WelcomeGreeting;