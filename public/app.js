document.addEventListener('DOMContentLoaded', function() {

  // Initialize
  let app = firebase.app();
  let features = ['auth', 'functions'].filter(
    feature => typeof app[feature] === 'function'
  );
  console.log(`Firebase SDK loaded with ${features.join(', ')}`);

  // Firebase Services
  const fun = firebase.functions();
  const auth = firebase.auth();

  // DOM Elements
  const loginBtn = document.getElementById('login');
  const logoutBtn = document.getElementById('logout');
  const profile = document.getElementById('profile');

  // Realtime listener for Auth State
  auth.onAuthStateChanged(user => {

    if (user) {
        profile.innerHTML = user.uid;
        loginBtn.style.visibility = 'hidden';
        logoutBtn.style.visibility = 'visible';
    } else {
        profile.innerHTML = 'not logged in';
        loginBtn.style.visibility = 'visible';
        logoutBtn.style.visibility = 'hidden';
    }
    
  });

  // Event Handlers

  loginBtn.onclick = () => auth.signInAnonymously();
  logoutBtn.onclick = () => auth.signOut();


  
  // Callable Functions
  const testFun = fun.httpsCallable('testFunction');
  const testFunButton = document.getElementById('testFunButton');

  document.getElementById('testFunButton').onclick = async () => {
    const response = await testFun({ message: 'Howdy!' });

    console.log(response);
  };


  var stripe = Stripe('pk_test_I8oRukspEZnH8cQ1N8QCi7rZ00YyYHO0mr');
  var elements = stripe.elements();

  const style = {
    base: {
      // Add your base input styles here. For example:
      fontSize: '16px',
      color: "#32325d",
    },
  };
  
  // Create an instance of the card Element.
  const card = elements.create('card', {style});

// Add an instance of the card Element into the `card-element` <div>.
  card.mount('#card-element');

  card.addEventListener('change', function(event) {
    var displayError = document.getElementById('card-errors');
    if (event.error) {
      displayError.textContent = event.error.message;
    } else {
      displayError.textContent = '';
    }
  });


  const form = document.getElementById('payment-form');
    form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const {source, error} = await stripe.createSource(card); // Changed fron Token to Source
      console.log(source)
    if (error) {
      // Inform the customer that there was an error.
      const errorElement = document.getElementById('card-errors');
      errorElement.textContent = error.message;
    } else {
      // Send the token to your server.
      sourceHandler(source);
    }
  });

  const attachFun = fun.httpsCallable('stripeAttachSource');
  const sourceHandler = async(source) => {
    console.log(source.id)
    const res = await attachFun({ source: source.id });
    console.log(res);
    alert('Success! source attached to customer');

  }
});