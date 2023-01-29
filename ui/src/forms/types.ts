import { ControllerProps } from 'react-hook-form';

export type FormControllerProps = Pick<ControllerProps, 'name' | 'control' | 'rules' | 'defaultValue'>;
