import { debounce } from "../debounce";

describe("debounce", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  it("should call function only once after delay", () => {
    const mockFn = jest.fn();

    const debounced = debounce(mockFn, 500);

    debounced();
    debounced();
    debounced();

    jest.advanceTimersByTime(500);

    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it("should pass arguments correctly", () => {
    const mockFn = jest.fn();

    const debounced = debounce(mockFn, 300);

    debounced("hello", 123);

    jest.advanceTimersByTime(300);

    expect(mockFn).toHaveBeenCalledWith("hello", 123);
  });

  it("should reset timer on rapid calls", () => {
    const mockFn = jest.fn();

    const debounced = debounce(mockFn, 200);

    debounced();
    jest.advanceTimersByTime(100);

    debounced();
    jest.advanceTimersByTime(100);

    debounced();

    jest.advanceTimersByTime(200);

    expect(mockFn).toHaveBeenCalledTimes(1);
  });
});
