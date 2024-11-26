import React from 'react';
import * as RadixSlider from '@radix-ui/react-slider';

interface SliderProps {
  label: string;
  value: number;
  onChange: (value: number[]) => void;
  min: number;
  max: number;
  step: number;
}

const Slider: React.FC<SliderProps> = ({ label, value, onChange, min, max, step }) => {
  return (
    <div>
      <div className="flex justify-between mb-3">
        <label className="text-lg font-medium">{label}</label>
        <span className="text-gray-400">{value}</span>
      </div>
      <RadixSlider.Root
        className="relative flex items-center w-full h-5"
        value={[value]}
        onValueChange={onChange}
        min={min}
        max={max}
        step={step}
      >
        <RadixSlider.Track className="bg-white/10 relative grow h-2 rounded-full">
          <RadixSlider.Range className="absolute h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
        </RadixSlider.Track>
        <RadixSlider.Thumb className="block w-5 h-5 bg-white rounded-full shadow-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500" />
      </RadixSlider.Root>
    </div>
  );
};

export default Slider;