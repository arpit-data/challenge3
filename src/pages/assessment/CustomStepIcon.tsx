/**
 * @fileoverview EcoPulse AI — Custom Step Icon Component.
 * 3D-styled step icon used in the assessment stepper.
 */

import React from 'react';
import { Check } from '@mui/icons-material';
import { StepIconRoot } from './constants';

/** Custom step icon component for the assessment stepper. */
export default function CustomStepIcon(props: {
  active?: boolean;
  completed?: boolean;
  icon: React.ReactNode;
}): React.JSX.Element {
  const { active, completed, icon } = props;
  return (
    <StepIconRoot ownerState={{ active, completed }}>
      {completed ? <Check sx={{ fontSize: 20 }} /> : icon}
    </StepIconRoot>
  );
}
