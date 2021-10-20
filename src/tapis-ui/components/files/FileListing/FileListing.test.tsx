import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import renderComponent from 'utils/testing';
import FileListing from './FileListing';
import { useList } from 'tapis-hooks/files';
import { fileInfo } from 'fixtures/files.fixtures';

jest.mock('tapis-hooks/files');

describe('Files', () => {

  it('renders File Listing component', () => {
    (useList as jest.Mock).mockReturnValue({
      concatenatedResults: [fileInfo],
      isLoading: false,
      error: null,
    });
    const { getAllByText } = renderComponent(
      <FileListing systemId={'system'} path={'/'} />
    );
    expect(getAllByText(/file1/).length).toEqual(1);
    expect(getAllByText(/01\/01\/2020/).length).toEqual(1);
    expect(getAllByText(/29.3 kB/).length).toEqual(1);
  });

  it('performs file selection', () => {
    (useList as jest.Mock).mockReturnValue({
      concatenatedResults: [fileInfo],
      isLoading: false,
      error: null,
    });
    const spy = jest.fn();
    const { getByTestId } = renderComponent(
      <FileListing systemId={'system'} path={'/'} select={{ mode: "multi", files: true, dirs: true }} onSelect={spy} />
    )
    // Find the file1.txt row
    const file1 = getByTestId("file1.txt");
    expect(file1).toBeDefined();

    // Click on file1.txt and expect the callback to have run
    file1.click();
    expect(spy).toHaveBeenLastCalledWith([ fileInfo ]);

    // Click on file1.txt again and expect the file to be "unselected"
    file1.click();
    expect(spy).toHaveBeenLastCalledWith([]);
  });
});
