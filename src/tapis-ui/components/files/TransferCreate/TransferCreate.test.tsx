import { act, screen, fireEvent, waitFor } from '@testing-library/react';
import renderComponent from 'utils/testing';
import TransferCancel from './TransferCreate';
import { useCreate } from 'tapis-hooks/files/transfers';
import { fileInfo } from 'fixtures/files.fixtures';

jest.mock('tapis-hooks/files/transfers');

describe('TransferCreate', () => {
  it('submits a file transfer', async () => {
    const createMock = jest.fn();
    const resetMock = jest.fn();
    (useCreate as jest.Mock).mockReturnValue({
      create: createMock,
      isLoading: false,
      error: null,
      isSuccess: false,
      reset: resetMock,
    });

    renderComponent(
      <TransferCancel
        sourceSystemId="source"
        destinationSystemId="destination"
        destinationPath="/dest"
        files={[fileInfo]}
      />
    );

    const input = screen.getByLabelText('Tag');
    await act(async () => {
      fireEvent.change(input, {
        target: {
          value: 'mytag',
        },
      });
    });

    const submit = screen.getByLabelText('Submit');
    await act(async () => {
      submit.click();
    });

    await waitFor(() => {
      const callParams = createMock.mock.calls[0];
      expect(resetMock).toBeCalledTimes(1);
      expect(callParams[0]).toEqual({
        tag: 'mytag',
        elements: [
          {
            destinationURI: 'tapis://destination/dest',
            sourceURI: 'tapis://source/file1.txt',
          },
        ],
      });
    });
  });
});
