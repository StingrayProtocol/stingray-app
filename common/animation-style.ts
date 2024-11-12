const beforeStepStyle = {
  opacity: 0,
  zIndex: -1,
};

const onStepStyle = {
  opacity: 1,
  zIndex: 0,
};

const afterStepStyle = {
  opacity: 0,
  zIndex: -1,
};

export const getAnimationStyle = (step: number, currentStep: number) => ({
  ...(currentStep < step
    ? beforeStepStyle
    : step === currentStep
    ? onStepStyle
    : afterStepStyle),
  transition: "opacity 0.3s ease-in-out",
});
