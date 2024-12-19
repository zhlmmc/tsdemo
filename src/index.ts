import { MathUtils, StringUtils, ArrayUtils } from './utils/basic';
import { ObjectUtils, AsyncUtils, DataUtils } from './utils/intermediate';
import { Patterns, Algorithms, Business } from './utils/advanced';
import { BoundaryUtils, PerformanceUtils, DependencyUtils } from './utils/special';
import { EventUtils, NetworkUtils, StateUtils, ValidationUtils } from './utils/complex';

// === 测试基础工具类 ===
console.log('\n=== Testing Basic Utils ===');

// 测试 MathUtils
console.log('\n--- Testing MathUtils ---');
console.log('Add 5 + 3:', MathUtils.add(5, 3));
console.log('Sum of [1,2,3,4,5]:', MathUtils.sum([1, 2, 3, 4, 5]));
console.log('Average of [1,2,3,4,5]:', MathUtils.average([1, 2, 3, 4, 5]));
console.log('Max of [1,2,3,4,5]:', MathUtils.findMax([1, 2, 3, 4, 5]));
console.log('Min of [1,2,3,4,5]:', MathUtils.findMin([1, 2, 3, 4, 5]));

// 测试 StringUtils
console.log('\n--- Testing StringUtils ---');
console.log('Reverse "hello":', StringUtils.reverse('hello'));
console.log('Slice "hello" (1,4):', StringUtils.slice('hello', 1, 4));
console.log('Match pattern "test@email.com":', 
    StringUtils.matchPattern('test@email.com', /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/));
console.log('To camel case "hello-world":', StringUtils.toCamelCase('hello-world'));

// 测试 ArrayUtils
console.log('\n--- Testing ArrayUtils ---');
const numbers = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5];
console.log('Original array:', numbers);
console.log('Sorted array:', ArrayUtils.sort(numbers));
console.log('Unique array:', ArrayUtils.unique(numbers));
console.log('Filtered array (>4):', ArrayUtils.filter(numbers, n => n > 4));
console.log('Chunked array (size 3):', ArrayUtils.chunk(numbers, 3));

// 测试基础工具类的边界情况
console.log('\n--- Testing Basic Utils Edge Cases ---');
console.log('Empty array sum:', MathUtils.sum([]));
console.log('Empty string reverse:', StringUtils.reverse(''));
console.log('Null array unique:', ArrayUtils.unique(null as any));
console.log('Empty array chunk:', ArrayUtils.chunk([], 2));

// 测试基础工具类的复杂示例
console.log('\n--- Testing Basic Utils Complex Examples ---');
const words = ['hello', 'world', 'typescript', 'javascript'];
const sortedWords = ArrayUtils.sort(words, (a, b) => b.length - a.length);
console.log('Words sorted by length (desc):', sortedWords);

const mixedArray = [1, 2, 2, 3, '3', '2', '1'];
const uniqueNumbers = ArrayUtils.unique(mixedArray);
console.log('Unique mixed array:', uniqueNumbers);

const kebabCaseStrings = ['first-name', 'last-name', 'email-address'];
const camelCaseStrings = kebabCaseStrings.map(str => StringUtils.toCamelCase(str));
console.log('Kebab to camel case:', camelCaseStrings);

// === 测试中级工具类 ===
console.log('\n=== Testing Intermediate Utils ===');

// 测试 ObjectUtils
console.log('\n--- Testing ObjectUtils ---');
const originalObj = {
    name: 'John',
    age: 30,
    address: {
        city: 'New York',
        country: 'USA'
    },
    hobbies: ['reading', 'gaming']
};

const clonedObj = ObjectUtils.deepClone(originalObj);
console.log('Deep cloned object:', clonedObj);

const userSchema = {
    name: { type: 'string', required: true },
    age: { type: 'number', min: 0, max: 120 },
    email: { type: 'string', pattern: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/ }
};

const validationResult = ObjectUtils.validateObject({
    name: 'John',
    age: 25,
    email: 'john@example.com'
}, userSchema);
console.log('Object validation:', validationResult);

// 测试 AsyncUtils
console.log('\n--- Testing AsyncUtils ---');
(async () => {
    // 测试延迟执行
    console.log('Starting delay...');
    await AsyncUtils.delay(1000);
    console.log('Delay completed');

    // 测试重试机制
    let attempts = 0;
    const unreliableFunction = async () => {
        attempts++;
        if (attempts < 3) {
            throw new Error('Temporary error');
        }
        return 'Success!';
    };

    try {
        const result = await AsyncUtils.retry(unreliableFunction, {
            maxAttempts: 3,
            delay: 100,
            backoff: 2
        });
        console.log('Retry result:', result);
    } catch (error) {
        console.error('Retry failed:', error);
    }
})();

// 测试 DataUtils
console.log('\n--- Testing DataUtils ---');
const now = new Date();
console.log('Formatted date:', DataUtils.formatDate(now, 'yyyy-MM-dd HH:mm:ss'));

const numberValue = DataUtils.convert<number>('123', 'number');
console.log('Converted number:', numberValue);

const jsonStr = '{"name": "John", "age": 30}';
const parsedJson = DataUtils.safeParseJSON(jsonStr, { name: '', age: 0 });
console.log('Parsed JSON:', parsedJson);

// === 测试高级工具类 ===
console.log('\n=== Testing Advanced Utils ===');

// 测试设计模式
console.log('\n--- Testing Patterns ---');
const observer = new Patterns.Observer<string>();
const unsubscribe = observer.subscribe(data => console.log('Received:', data));
observer.notify('Hello from observer!');
unsubscribe();

const productA = Patterns.Factory.createProduct('A');
console.log('Factory created:', productA.operation());

// 测试算法
console.log('\n--- Testing Algorithms ---');
const unsortedArray = [64, 34, 25, 12, 22, 11, 90];
console.log('Quick sort:', Algorithms.quickSort(unsortedArray, (a, b) => a - b));

const sortedArray = [11, 12, 22, 25, 34, 64, 90];
console.log('Binary search for 25:', 
    Algorithms.binarySearch(sortedArray, 25, (a, b) => a - b));

// 测试业务逻辑
console.log('\n--- Testing Business Logic ---');
const cartItems = [
    { id: '1', price: 100, quantity: 2, discount: 0.1 },
    { id: '2', price: 50, quantity: 1 }
];
console.log('Cart calculation:', Business.calculateCart(cartItems));

const user = {
    roles: ['user'],
    permissions: ['read', 'write']
};
console.log('Permission check:', 
    Business.validatePermissions(user, ['read']));

const dataSet = [1, 2, 2, 3, 4, 4, 4, 5];
console.log('Data analysis:', Business.analyzeData(dataSet));

// === 测试特殊场景工具类 ===
console.log('\n=== Testing Special Utils ===');

// 测试边界条件处理
console.log('\n--- Testing Boundary Utils ---');
const obj = { name: 'John', age: 30 };
console.log('Safe get:', BoundaryUtils.safeGet(obj, 'name', 'Unknown'));
console.log('Coalesce:', BoundaryUtils.coalesce(null, undefined, 0, null, 5));
console.log('To number:', BoundaryUtils.toNumber('123.45'));

// 测试性能工具
console.log('\n--- Testing Performance Utils ---');
const expensiveFunction = (n: number) => {
    console.log('Computing...');
    return n * 2;
};
const memoizedFn = PerformanceUtils.memoize(expensiveFunction);
console.log('First call:', memoizedFn(5));
console.log('Cached call:', memoizedFn(5));

const debouncedFn = PerformanceUtils.debounce((text: string) => {
    console.log('Debounced:', text);
}, 1000);
debouncedFn('test1');
debouncedFn('test2');

// 测试依赖注入
console.log('\n--- Testing Dependency Utils ---');
interface UserService {
    getUser(id: string): { id: string; name: string };
}
const mockUserService: UserService = {
    getUser: (id) => ({ id, name: 'Mock User' })
};
DependencyUtils.register('userService', mockUserService);
const userService = DependencyUtils.resolve<UserService>('userService');
console.log('Mock service result:', userService.getUser('123'));

// === 测试复杂场景工具类 ===
console.log('\n=== Testing Complex Utils ===');

// 测试事件处理
console.log('\n--- Testing Event Utils ---');
const unsubscribeEvent = EventUtils.on('userLogin', (userId) => {
    console.log('User logged in:', userId);
});
EventUtils.emit('userLogin', 'user123');
unsubscribeEvent();

// 测试事件队列
(async () => {
    const events = ['event1', 'event2', 'event3'];
    let processedEvents: string[] = [];
    
    await EventUtils.processEventQueue(events, 
        async (event) => {
            await new Promise(resolve => setTimeout(resolve, 100));
            processedEvents.push(event);
            console.log('Processed event:', event);
        },
        {
            concurrent: 2,
            retryCount: 1,
            onError: (error, event) => console.error(`Error processing ${event}:`, error)
        }
    );
})();

// 测试网络请求
console.log('\n--- Testing Network Utils ---');
(async () => {
    try {
        const data = await NetworkUtils.fetchWithCache('https://api.example.com/data', {
            cacheDuration: 5000,
            headers: { 'Content-Type': 'application/json' }
        });
        console.log('Cached data:', data);
    } catch (error) {
        console.error('Network error:', error);
    }

    try {
        const data = await NetworkUtils.fetchWithRetry('https://api.example.com/data', {
            retryCount: 3,
            timeout: 2000,
            onRetry: (error, attempt) => console.log(`Retry attempt ${attempt}:`, error)
        });
        console.log('Fetched data:', data);
    } catch (error) {
        console.error('Network error after retries:', error);
    }
})();

// 测试状态管理
console.log('\n--- Testing State Utils ---');
StateUtils.setState('user', { name: 'John', age: 30 }, { keepHistory: true });
console.log('Current state:', StateUtils.getState('user'));

const unsubscribeState = StateUtils.subscribe('user', (state) => {
    console.log('State updated:', state);
});

StateUtils.setState('user', { name: 'John', age: 31 }, { keepHistory: true });
console.log('Undo result:', StateUtils.undo('user'));
console.log('State after undo:', StateUtils.getState('user'));
unsubscribeState();

// 测试复杂验证
console.log('\n--- Testing Validation Utils ---');
const complexData = {
    user: {
        name: 'John Doe',
        email: 'john@example.com',
        age: 25,
        address: {
            street: '123 Main St',
            city: 'New York',
            zipCode: '10001'
        }
    },
    settings: {
        theme: 'dark',
        notifications: true
    }
};

const validationRules = {
    user: {
        type: 'object',
        nested: {
            name: { type: 'string', required: true, min: 2, max: 50 },
            email: { 
                type: 'string', 
                required: true, 
                pattern: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
            },
            age: { type: 'number', min: 18, max: 120 },
            address: {
                type: 'object',
                nested: {
                    street: { type: 'string', required: true },
                    city: { type: 'string', required: true },
                    zipCode: { 
                        type: 'string', 
                        pattern: /^\d{5}(-\d{4})?$/
                    }
                }
            }
        }
    },
    settings: {
        type: 'object',
        nested: {
            theme: { 
                type: 'string',
                custom: (value: string) => ['light', 'dark'].includes(value)
            },
            notifications: { type: 'boolean' }
        }
    }
};

const complexValidationResult = ValidationUtils.validateComplex(complexData, validationRules);
console.log('Validation result:', complexValidationResult);

// 测试无效数据
const invalidData = {
    user: {
        name: 'J',  // too short
        email: 'invalid-email',  // invalid format
        age: 15,    // too young
        address: {
            street: '',  // required but empty
            city: 'New York',
            zipCode: '123'  // invalid format
        }
    },
    settings: {
        theme: 'blue',  // invalid theme
        notifications: 'yes'  // should be boolean
    }
};

const invalidResult = ValidationUtils.validateComplex(invalidData, validationRules);
console.log('Invalid data validation result:', invalidResult); 