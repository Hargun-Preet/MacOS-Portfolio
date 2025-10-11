import React, { useEffect, useState } from "react";

// (Your icon mapping and helper function can remain the same)
const batteryIconMap = [
  { min: 81, max: 100, src: "/assets/icons/battery-full.png" },
  { min: 51, max: 80,  src: "/assets/icons/battery-high.png" },
  { min: 21, max: 50,  src: "/assets/icons/battery-medium.png" },
  { min: 0,  max: 20,  src: "/assets/icons/battery-low.png" },
];
const chargingIconSrc = "/assets/icons/battery-charging.png";
const unknownIconSrc = "/assets/icons/battery-full.png";

const getBatteryIcon = (level: number | null, isCharging: boolean): string => {
    if (isCharging) return chargingIconSrc;
    if (level === null) return unknownIconSrc;
    const icon = batteryIconMap.find(i => level >= i.min && level <= i.max);
    return icon ? icon.src : unknownIconSrc;
};


export default function BatteryStatus() {
  const [level, setLevel] = useState<number | null>(null);
  const [charging, setCharging] = useState(false);

  useEffect(() => {
    // Check if the Battery API is supported
    if (!("getBattery" in navigator)) {
      return;
    }

    let batteryManager: BatteryManager | null = null;

    const updateBatteryInfo = () => {
      if (batteryManager) {
        setLevel(Math.round(batteryManager.level * 100));
        setCharging(batteryManager.charging);
      }
    };

    navigator.getBattery().then((bat) => {
      batteryManager = bat;
      updateBatteryInfo();

      // Add event listeners
      bat.addEventListener("levelchange", updateBatteryInfo);
      bat.addEventListener("chargingchange", updateBatteryInfo);
    });

    // The cleanup function should remove listeners from the `batteryManager`
    // object when it's available.
    return () => {
      if (batteryManager) {
        batteryManager.removeEventListener("levelchange", updateBatteryInfo);
        batteryManager.removeEventListener("chargingchange", updateBatteryInfo);
      }
    };
  }, []);

  const currentIconSrc = getBatteryIcon(level, charging);

  if (level === null) {
    return (
      <div className="flex items-center text-[0.85rem] space-x-1.5">
        <span>100%</span>
        <img
          src={unknownIconSrc}
          alt="Battery status unknown"
          className="h-7 object-contain dark:invert"
        />
      </div>
    );
  }

  return (
    <div className="flex text-[0.85rem] items-center space-x-1.5">
      <span className="mt-0.5">{level}%</span>
      <img
        src={currentIconSrc}
        alt={`Battery status: ${charging ? "Charging" : `${level}%`}`}
        className="h-7 w-auto object-contain dark:invert"
      />
    </div>
  );
}
