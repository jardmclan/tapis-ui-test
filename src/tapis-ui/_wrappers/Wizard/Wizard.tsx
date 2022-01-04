import React, { useState, useContext, useCallback, useEffect } from 'react';
import StepWizard, { StepWizardChildProps } from 'react-step-wizard';
import {
  useForm,
  useFormContext,
  FormProvider,
  SubmitHandler,
  UnpackNestedValue,
  DeepPartial,
} from 'react-hook-form';
import { Button } from 'reactstrap';
import { WizardStep } from '.';
import styles from './Wizard.module.scss';

export type WizardContextType = Partial<StepWizardChildProps>;

const WizardContext: React.Context<WizardContextType> =
  React.createContext<WizardContextType>({});

type WizardProps<T> = {
  steps: Array<WizardStep>;
  memo?: Array<any>;
  defaultValues?: Partial<T>;
};

export const useWizard = () => {
  const props = useContext(WizardContext);
  return props;
};

type StepContainerProps = {
  step: WizardStep;
} & Partial<StepWizardChildProps>;

function StepContainer<T>(props: StepContainerProps) {
  const { handleSubmit } = useFormContext<T>();
  const { nextStep, currentStep, previousStep, totalSteps, step } = props;
  const formSubmit: SubmitHandler<T> = () => {
    nextStep && nextStep();
  };
  return (
    <form onSubmit={handleSubmit<T>(formSubmit)}>
      {step.render}
      <div className={styles.controls}>
        {!!currentStep && currentStep > 1 && (
          <Button onClick={previousStep} type="submit">
            Back
          </Button>
        )}
        {!!currentStep && !!totalSteps && currentStep < totalSteps && (
          <Button type="submit" color="primary">
            Continue
          </Button>
        )}
      </div>
    </form>
  );
}

type WizardControlProps = {
  steps: Array<WizardStep>;
} & Partial<StepWizardChildProps>;

const WizardSummary: React.FC<WizardControlProps> = ({
  steps,
  ...stepWizardProps
}) => {
  const { goToNamedStep } = stepWizardProps;
  const editCallback = useCallback(
    (stepId: string) => goToNamedStep && goToNamedStep(stepId),
    [goToNamedStep]
  );
  return (
    <div className={styles.summary}>
      {steps.map((step) => (
        <div className={styles['step-summary']}>
          <div className={styles.name}>
            <b>{step.name}</b>
            <Button
              color="link"
              onClick={() => editCallback(step.id)}
              className={styles.edit}
            >
              edit
            </Button>
          </div>
          <div className={styles.content}>{step.summary}</div>
        </div>
      ))}
    </div>
  );
};

const WizardProgress: React.FC<WizardControlProps> = ({
  steps,
  ...stepWizardProps
}) => {
  const { currentStep } = stepWizardProps;
  if (currentStep === undefined) {
    return null;
  }
  return <div>{steps[currentStep - 1].name}</div>;
};

function Wizard<T>(props: WizardProps<T>) {
  const { steps, memo, defaultValues } = props;
  const methods = useForm<T>();

  const [stepWizardProps, setStepWizardProps] = useState<
    Partial<StepWizardChildProps>
  >({});

  const instanceCallback = useCallback(
    (props: Partial<StepWizardChildProps>) => {
      setStepWizardProps({
        currentStep: 1,
        totalSteps: steps.length,
        ...props,
      });
    },
    [setStepWizardProps, steps]
  );

  const stepChangeCallback = useCallback(
    ({ activeStep }: { previousStep: number; activeStep: number }) => {
      setStepWizardProps({
        ...stepWizardProps,
        currentStep: activeStep,
      });
    },
    [setStepWizardProps, stepWizardProps]
  );

  const { goToStep } = stepWizardProps;
  const { reset } = methods;

  useEffect(
    () => {
      const resetValue: UnpackNestedValue<DeepPartial<T>> =
        (defaultValues as UnpackNestedValue<DeepPartial<T>>) ??
        ({} as UnpackNestedValue<DeepPartial<T>>);
      reset && reset(resetValue);
      goToStep && goToStep(1);
    },
    /* eslint-disable-nextline */
    [memo]
  );

  return (
    <FormProvider {...methods}>
      <WizardContext.Provider value={stepWizardProps}>
        <div className={styles.container}>
          <StepWizard
            nav={<WizardProgress steps={steps} {...stepWizardProps} />}
            instance={instanceCallback}
            className={styles.steps}
            onStepChange={stepChangeCallback}
            transitions={{}}
          >
            {steps.map((step) => (
              <StepContainer stepName={step.id} step={step} />
            ))}
          </StepWizard>
          <WizardSummary steps={steps} {...stepWizardProps} />
        </div>
      </WizardContext.Provider>
    </FormProvider>
  );
}

export default React.memo(Wizard) as typeof Wizard;
