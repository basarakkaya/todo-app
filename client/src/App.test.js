import { shallow } from 'enzyme';
import { findByTestAttr } from '../test/testUtils';
import App from './App';

test('renders app without error', () => {
  const component = findByTestAttr(shallow(<App />), 'app');
  expect(component.length).toBe(1);
});
