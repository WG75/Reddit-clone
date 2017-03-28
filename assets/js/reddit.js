var reddit;

(function(){

document.addEventListener('DOMContentLoaded', function(){

  var Snoocore = window.Snoocore;
   reddit = new Snoocore({

    userAgent: '/u/username myApp@3.0.0', // unique string identifying the app
    oauth:  {
      type: 'script',
      key: 'KBFlJYWLsdUILA', // OAuth client key (provided at reddit app)
      secret: 'B3aVE8WzjcUCi5OnxxS7yU_1d9E', // OAuth secret (provided at reddit app)
      username: 'reddirapi', // Reddit username used to make the reddit app
      password: 'redditapi', // Reddit password for the username
      // The OAuth scopes that we need to make the calls that we
      // want. The reddit documentation will specify which scope
      // is needed for evey call
      scope: [ 'identity', 'read', 'vote' ]
    }
  });

  reddit('/new').get().then(function(data) {

  });

})



})();
