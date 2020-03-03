import * as TestFunctions from 'firebase-functions-test';

const firebaseConfig = {
    databaseURL: "https://fireship-stripe-97f15.firebaseio.com",
    projectId: "fireship-stripe-97f15",
    storageBucket:  "fireship-stripe-97f15.appspot.com",
}

const envConfig = { stripe: { secret: 'sk_test_Bs41yrtCSh2CZ15mDcxvDjqd00qaVCYADp' }};

const fun = TestFunctions(firebaseConfig, 'service-account.json')

fun.mockConfig(envConfig);

export { fun };
