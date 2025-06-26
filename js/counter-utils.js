// Counter functionality for any elements that need counting
export function setupCounter(element, initialValue = 0, step = 1) {
  let counter = initialValue;
  
  const setCounter = (count) => {
    counter = count;
    element.innerHTML = `Count: ${counter}`;
  };
  
  element.addEventListener('click', () => setCounter(counter + step));
  
  // Initialize counter
  setCounter(initialValue);
  
  // Return methods to control the counter externally
  return {
    increment: () => setCounter(counter + step),
    decrement: () => setCounter(counter - step),
    reset: () => setCounter(initialValue),
    getValue: () => counter,
    setValue: (value) => setCounter(value)
  };
}