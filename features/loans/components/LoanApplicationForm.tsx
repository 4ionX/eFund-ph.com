import React from 'react';

import { ThemedView } from '../../../shared/components/theme/ThemedView';
import AnimatedButton from '../../../shared/components/ui/AnimatedButton';
import { ThemedTextInput } from '../../../shared/components/theme/ThemedTextInput';

import { Field } from '@/shared/components/ui/Field';
import Dropdown from '@/shared/components/ui/Dropdown';
import { ThemedText } from '@/shared/components/theme/ThemedText';
import { bankOptions, eWalletOptions } from '../constants/loan.options';
import type { DisbursementMethod, LoanType, Provider } from '../types/loans';

type LoanProps = {
  loanType: LoanType;
  setLoanType: (value: LoanType) => void;

  loanAmount: string;
  setLoanAmount: (value: string) => void;

  disbursementMethod: DisbursementMethod;
  setDisbursementMethod: (value: DisbursementMethod) => void;

  selectedWallet: Provider | '';
  setSelectedWallet: (value: Provider | '') => void;

  selectedBank: Provider | '';
  setSelectedBank: (value: Provider | '') => void;

  accountName: string;
  setAccountName: (value: string) => void;

  accountNumber: string;
  setAccountNumber: (value: string) => void;

  confirmAccountNumber: string;
  setConfirmAccountNumber: (value: string) => void;

  errors?: Record<string, string>;
  handleSubmit?: () => void;

  isLoading: boolean;
};

const LoanApplicationForm = ({
  loanType,
  setLoanType,
  loanAmount,
  setLoanAmount,
  disbursementMethod,
  setDisbursementMethod,
  selectedWallet,
  setSelectedWallet,
  selectedBank,
  setSelectedBank,
  accountName,
  setAccountName,
  accountNumber,
  setAccountNumber,
  setConfirmAccountNumber,
  confirmAccountNumber,
  errors = {},
  handleSubmit,
  isLoading,
}: LoanProps) => {
  return (
    <ThemedView>
      {/* LOAN TYPE */}
      <Field>
        <Dropdown
          label="Select Loan Type"
          options={['Regular', 'Special', 'Salary', 'Emergency']}
          value={loanType}
          onChange={setLoanType}
        />
        <ThemedText type="caption">Regular - 4 to 5 weeks</ThemedText>
        <ThemedText type="caption">Special - 8 weeks</ThemedText>
        <ThemedText type="caption">Emergency - 1 week</ThemedText>
        <ThemedText type="caption">
          Salary - Based on agreement with the admin
        </ThemedText>
      </Field>
      {/* AMOUNT */}
      <Field>
        <ThemedTextInput
          placeholder="Enter Loan amount"
          value={loanAmount}
          onChangeText={setLoanAmount}
          keyboardType="decimal-pad"
          error={!!errors.loanAmount}
          errorMessage={errors.loanAmount}
        />
      </Field>

      {/* DISBURSEMENT METHOD */}
      <Field>
        <Dropdown
          label="Disbursement Method"
          options={['eWallet', 'Bank']}
          value={disbursementMethod}
          onChange={setDisbursementMethod}
        />
      </Field>

      {/* WALLET */}
      {disbursementMethod === 'eWallet' && (
        <Field>
          <Dropdown
            label="eWallet"
            options={eWalletOptions}
            value={selectedWallet}
            onChange={setSelectedWallet}
          />
        </Field>
      )}

      {/* BANK */}
      {disbursementMethod === 'Bank' && (
        <Field>
          <Dropdown
            label="Bank"
            options={bankOptions}
            value={selectedBank}
            onChange={setSelectedBank}
          />
        </Field>
      )}

      <Field>
        {/* ACCOUNT NAME */}
        <ThemedTextInput
          placeholder="Enter account name"
          value={accountName}
          onChangeText={setAccountName}
          error={!!errors.accountName}
          errorMessage={errors.accountName}
        />
        {/* ACCOUNT NUMBER */}
        <ThemedTextInput
          placeholder="Enter account number"
          value={accountNumber}
          onChangeText={setAccountNumber}
          keyboardType="number-pad"
          error={!!errors.accountNumber}
          errorMessage={errors.accountNumber}
        />
        {/* CONFIRM ACCOUNT NUMBER */}
        <ThemedTextInput
          placeholder="Confirm account number"
          value={confirmAccountNumber}
          onChangeText={setConfirmAccountNumber}
          keyboardType="number-pad"
          error={!!errors.confirmAccountNumber}
          errorMessage={errors.confirmAccountNumber}
        />
      </Field>

      {/* SUBMIT */}
      <Field>
        <AnimatedButton
          label={isLoading ? 'Proceeding...' : 'Proceed'}
          onPress={handleSubmit}
        />
      </Field>
    </ThemedView>
  );
};

export default LoanApplicationForm;
