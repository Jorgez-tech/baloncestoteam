import { customRender } from '../../test-utils';

export * from '../../test-utils';

test('bridge exports customRender', () => {
    expect(typeof customRender).toBe('function');
});
