'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface AnonymousFilterProps {
  monthlyIncome: number;
  age: number;
  employmentType: 'salaried' | 'self-employed';
  onFilterChange: (filters: { monthlyIncome: number; age: number; employmentType: 'salaried' | 'self-employed' }) => void;
}

export default function AnonymousFilter({
  monthlyIncome,
  age,
  employmentType,
  onFilterChange,
}: AnonymousFilterProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleIncomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    onFilterChange({ monthlyIncome: value, age, employmentType });
  };

  const handleAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    onFilterChange({ monthlyIncome, age: value, employmentType });
  };

  const handleEmploymentToggle = () => {
    const newType = employmentType === 'salaried' ? 'self-employed' : 'salaried';
    onFilterChange({ monthlyIncome, age, employmentType: newType });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="mb-6"
    >
      {/* Collapsed header */}
      <motion.button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 rounded-2xl"
        style={{
          background: 'rgba(201, 169, 110, 0.08)',
          border: '1px solid rgba(201, 169, 110, 0.15)',
        }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="text-left">
          <p
            className="text-[12px] tracking-widest uppercase font-700 text-[#C9A96E]"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700 }}
          >
            Smart Filter
          </p>
          <p className="font-body text-[10px] text-white/35 mt-0.5">
            Personalized for you • Anonymous • No tracking
          </p>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="flex-shrink-0 text-[#C9A96E]"
        >
          <ChevronDown size={18} />
        </motion.div>
      </motion.button>

      {/* Expanded content */}
      <motion.div
        initial={false}
        animate={{
          height: isExpanded ? 'auto' : 0,
          opacity: isExpanded ? 1 : 0,
          marginTop: isExpanded ? 12 : 0,
        }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        style={{ overflow: 'hidden' }}
      >
        <div className="space-y-5 p-4 rounded-2xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
          {/* Income Slider */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label
                className="text-[12px] font-700 text-white/70"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700 }}
              >
                Monthly In-Hand Income
              </label>
              <span
                className="text-[13px] font-700 text-[#C9A96E]"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700 }}
              >
                ₹{monthlyIncome.toLocaleString('en-IN')}
              </span>
            </div>
            <input
              type="range"
              min="10000"
              max="500000"
              step="10000"
              value={monthlyIncome}
              onChange={handleIncomeChange}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer"
              style={{
                background: 'linear-gradient(to right, #C9A96E 0%, #C9A96E ' + ((monthlyIncome - 10000) / (500000 - 10000)) * 100 + '%, rgba(255,255,255,0.1) ' + ((monthlyIncome - 10000) / (500000 - 10000)) * 100 + '%, rgba(255,255,255,0.1) 100%)',
              }}
            />
            <div className="flex items-center justify-between mt-2 text-[9px] text-white/25">
              <span>₹10k</span>
              <span>₹5L</span>
            </div>
          </div>

          {/* Age Slider */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label
                className="text-[12px] font-700 text-white/70"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700 }}
              >
                Age
              </label>
              <span
                className="text-[13px] font-700 text-[#38BDF8]"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700 }}
              >
                {age} years
              </span>
            </div>
            <input
              type="range"
              min="18"
              max="70"
              step="1"
              value={age}
              onChange={handleAgeChange}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer"
              style={{
                background: 'linear-gradient(to right, #38BDF8 0%, #38BDF8 ' + ((age - 18) / (70 - 18)) * 100 + '%, rgba(255,255,255,0.1) ' + ((age - 18) / (70 - 18)) * 100 + '%, rgba(255,255,255,0.1) 100%)',
              }}
            />
            <div className="flex items-center justify-between mt-2 text-[9px] text-white/25">
              <span>18</span>
              <span>70</span>
            </div>
          </div>

          {/* Employment Type Toggle */}
          <div>
            <p
              className="text-[12px] font-700 text-white/70 mb-3"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700 }}
            >
              Employment Type
            </p>
            <div className="flex gap-2">
              {['salaried', 'self-employed'].map((type) => (
                <motion.button
                  key={type}
                  onClick={handleEmploymentToggle}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 py-2.5 rounded-lg font-body text-[11px] font-medium transition-all"
                  style={{
                    background:
                      employmentType === type
                        ? 'rgba(201, 169, 110, 0.15)'
                        : 'rgba(255,255,255,0.04)',
                    border:
                      employmentType === type
                        ? '1px solid rgba(201, 169, 110, 0.35)'
                        : '1px solid rgba(255,255,255,0.07)',
                    color: employmentType === type ? '#C9A96E' : 'rgba(255,255,255,0.45)',
                  }}
                >
                  {type === 'salaried' ? 'Salaried' : 'Self-Employed'}
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Custom slider styling */}
      <style jsx>{`
        input[type='range']::-webkit-slider-thumb {
          appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #C9A96E;
          cursor: pointer;
          box-shadow: 0 0 8px rgba(201, 169, 110, 0.5);
          transition: all 0.2s;
        }

        input[type='range']::-webkit-slider-thumb:hover {
          width: 20px;
          height: 20px;
          box-shadow: 0 0 12px rgba(201, 169, 110, 0.8);
        }

        input[type='range']::-moz-range-thumb {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #C9A96E;
          cursor: pointer;
          border: none;
          box-shadow: 0 0 8px rgba(201, 169, 110, 0.5);
          transition: all 0.2s;
        }

        input[type='range']::-moz-range-thumb:hover {
          width: 20px;
          height: 20px;
          box-shadow: 0 0 12px rgba(201, 169, 110, 0.8);
        }
      `}</style>
    </motion.div>
  );
}
