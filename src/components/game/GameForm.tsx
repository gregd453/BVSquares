import React, { useState } from 'react';
import Button from '@/components/ui/Button';
import FormField from '@/components/ui/FormField';
import { GameForm as GameFormType, PayoutStructure } from '@/types';
import { validateGameForm } from '@/utils/validation';

interface GameFormProps {
  initialData?: Partial<GameFormType>;
  onSubmit: (data: GameFormType) => Promise<void>;
  isLoading?: boolean;
  isEditing?: boolean;
}

const defaultPayout: PayoutStructure = {
  firstQuarter: 25,
  secondQuarter: 25,
  thirdQuarter: 25,
  finalScore: 25
};

const GameForm: React.FC<GameFormProps> = ({
  initialData,
  onSubmit,
  isLoading = false,
  isEditing = false
}) => {
  const [formData, setFormData] = useState<GameFormType>({
    name: initialData?.name || '',
    sport: initialData?.sport || 'football',
    homeTeam: initialData?.homeTeam || '',
    awayTeam: initialData?.awayTeam || '',
    gameDate: initialData?.gameDate || '',
    payoutStructure: initialData?.payoutStructure || { ...defaultPayout }
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const sportOptions = [
    { value: 'football', label: '🏈 Football' },
    { value: 'basketball', label: '🏀 Basketball' },
    { value: 'soccer', label: '⚽ Soccer' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('payout_')) {
      const payoutField = name.replace('payout_', '') as keyof PayoutStructure;
      setFormData(prev => ({
        ...prev,
        payoutStructure: {
          ...prev.payoutStructure,
          [payoutField]: Number(value) || 0
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // Clear field error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors = validateGameForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Form submission failed:', error);
    }
  };

  const totalPayout = Object.values(formData.payoutStructure).reduce((sum, val) => sum + val, 0);

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Game Information */}
        <div className="bg-white p-6 rounded-lg border border-neutral-200">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">
            Game Information
          </h3>
          
          <div className="space-y-4">
            <FormField
              label="Game Name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleInputChange}
              error={errors.name}
              placeholder="e.g., Super Bowl 2024, Lakers vs Warriors"
              required
              disabled={isLoading}
            />

            <FormField
              label="Sport"
              name="sport"
              type="select"
              value={formData.sport}
              onChange={handleInputChange}
              error={errors.sport}
              options={sportOptions}
              required
              disabled={isLoading}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Home Team"
                name="homeTeam"
                type="text"
                value={formData.homeTeam}
                onChange={handleInputChange}
                error={errors.homeTeam}
                placeholder="Home team name"
                required
                disabled={isLoading}
              />

              <FormField
                label="Away Team"
                name="awayTeam"
                type="text"
                value={formData.awayTeam}
                onChange={handleInputChange}
                error={errors.awayTeam}
                placeholder="Away team name"
                required
                disabled={isLoading}
              />
            </div>

            <FormField
              label="Game Date & Time"
              name="gameDate"
              type="datetime-local"
              value={formData.gameDate}
              onChange={handleInputChange}
              error={errors.gameDate}
              required
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Payout Structure */}
        <div className="bg-white p-6 rounded-lg border border-neutral-200">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">
            Payout Structure
          </h3>
          
          <div className="space-y-4">
            <p className="text-sm text-neutral-600 mb-4">
              Define what percentage of the pot goes to winners of each period. 
              Total must equal 100%.
            </p>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                label="1st Quarter"
                name="payout_firstQuarter"
                type="number"
                value={formData.payoutStructure.firstQuarter}
                onChange={handleInputChange}
                min={0}
                max={100}
                step={5}
                disabled={isLoading}
              />

              <FormField
                label="2nd Quarter"
                name="payout_secondQuarter"
                type="number"
                value={formData.payoutStructure.secondQuarter}
                onChange={handleInputChange}
                min={0}
                max={100}
                step={5}
                disabled={isLoading}
              />

              <FormField
                label="3rd Quarter"
                name="payout_thirdQuarter"
                type="number"
                value={formData.payoutStructure.thirdQuarter}
                onChange={handleInputChange}
                min={0}
                max={100}
                step={5}
                disabled={isLoading}
              />

              <FormField
                label="Final Score"
                name="payout_finalScore"
                type="number"
                value={formData.payoutStructure.finalScore}
                onChange={handleInputChange}
                min={0}
                max={100}
                step={5}
                disabled={isLoading}
              />
            </div>

            <div className={`p-3 rounded-md ${
              totalPayout === 100 
                ? 'bg-success/10 border border-success/20' 
                : 'bg-warning/10 border border-warning/20'
            }`}>
              <p className={`text-sm font-medium ${
                totalPayout === 100 ? 'text-success' : 'text-warning'
              }`}>
                Total Payout: {totalPayout}%
                {totalPayout !== 100 && (
                  <span className="block text-xs mt-1">
                    Must equal 100% to proceed
                  </span>
                )}
              </p>
            </div>

            {errors.payoutStructure && (
              <p className="text-sm text-error">{errors.payoutStructure}</p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isLoading}
            disabled={totalPayout !== 100}
          >
            {isLoading 
              ? (isEditing ? 'Updating Game...' : 'Creating Game...') 
              : (isEditing ? 'Update Game' : 'Create Game')
            }
          </Button>
          
          <Button
            type="button"
            variant="tertiary"
            size="lg"
            onClick={() => window.history.back()}
            disabled={isLoading}
          >
            Cancel
          </Button>
        </div>

        {/* Game Rules Reminder */}
        <div className="bg-neutral-50 p-4 rounded-md">
          <h4 className="text-sm font-medium text-neutral-900 mb-2">
            Game Rules:
          </h4>
          <ul className="text-sm text-neutral-600 space-y-1">
            <li>• Each game has a 10x10 grid (100 squares)</li>
            <li>• Players request squares which require admin approval</li>
            <li>• Numbers 0-9 are randomly assigned to rows and columns after approval</li>
            <li>• Winners are determined by the last digit of each team's score</li>
            <li>• No actual money is exchanged through this platform</li>
          </ul>
        </div>
      </form>
    </div>
  );
};

export default GameForm;