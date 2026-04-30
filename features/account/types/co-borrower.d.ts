import type { Children } from './children';
import type { PersonalInformation } from './personal-information';

export interface CoBorrower extends PersonalInformation {
  children?: Children[];
}
