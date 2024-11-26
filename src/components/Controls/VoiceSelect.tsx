import React from 'react';
import * as Select from '@radix-ui/react-select';

interface VoiceSelectProps {
  value: string;
  onChange: (value: string) => void;
}

const voices = [
  { id: 'normal', name: 'Normal' },
  { id: 'robot', name: '🤖 Robot' },
  { id: 'alien', name: '👽 Alien' },
  { id: 'demon', name: '😈 Demon' },
  { id: 'chipmunk', name: '🐿️ Chipmunk' },
  { id: 'echo', name: '🔊 Echo' },
  { id: 'underwater', name: '🌊 Underwater' },
];

const VoiceSelect: React.FC<VoiceSelectProps> = ({ value, onChange }) => {
  return (
    <div>
      <label className="block mb-3 text-lg font-medium">Voice Effect</label>
      <Select.Root value={value} onValueChange={onChange}>
        <Select.Trigger className="w-full px-4 py-3 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors duration-200">
          <Select.Value />
        </Select.Trigger>
        <Select.Portal>
          <Select.Content className="bg-gray-800/95 backdrop-blur-xl rounded-xl p-2 shadow-xl border border-white/10">
            <Select.Viewport>
              {voices.map(({ id, name }) => (
                <Select.Item
                  key={id}
                  value={id}
                  className="px-4 py-3 rounded-lg hover:bg-white/10 cursor-pointer transition-colors duration-200 outline-none"
                >
                  <Select.ItemText>{name}</Select.ItemText>
                </Select.Item>
              ))}
            </Select.Viewport>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    </div>
  );
};

export default VoiceSelect;