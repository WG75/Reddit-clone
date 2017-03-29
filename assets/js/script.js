(function(){

  "use strict";

//listen for the dom and when it's loaded excute fun (excuteCode)
  document.addEventListener('DOMContentLoaded', excuteCode);

  function excuteCode(){

    var postsHolder = document.querySelector('.posts-container');
    var nav = document.querySelector('.main-nav');
    var currentPostsContainer;


    var app = {
      url: 'hot',
      template: document.querySelector('#post-template').cloneNode(true),
    }

//pull data from the reddit api then loops over
//the returned data (posts) and pass to app.buildPost function.
    app.fetch = function(url){

      app.isLoading(true);

      currentPostsContainer = document.querySelector('.posts');
      currentPostsContainer.innerHTML = "";
      var postsClone = currentPostsContainer.cloneNode(true);

      if(url == 'glided' || url == 'promoted' || url == 'wiki'){
        postsClone.innerHTML = "<img class='error' src='assets/img/reddit-broke.jpg'>"
        postsHolder.replaceChild(postsClone, currentPostsContainer);
        app.isLoading(false);
        return;
      }

        reddit('/' + url).get().then(function(data){
          var posts = data.data.children;
          for(var i = 0; i < posts.length; i++){
            app.buildPosts(posts[i], i, postsClone);
          }
          postsHolder.replaceChild(postsClone, currentPostsContainer);

          app.isLoading(false);

        });

    }


    app.buildPosts = function buildPosts(post, num, clone){
      var order = num + 1;
      var score = post.data.score;
      var thumb = post.data.thumbnail;
      var title = post.data.title;
      var domain = post.data.domain;
      var author = post.data.author;
      var sub = post.data.subreddit_name_prefixed;
      var comments_num = post.data.num_comments;
      var expand = !post.data.media ?
                  (post.data.selftext ?
                   "selftext" : null) : "video";

      var time = (function convertTime(){
        var newDate = new Date().getTime();
        var seconds = Math.floor((newDate / 1000) - post.data.created_utc);
        var formatedTime;

        switch (true){
                case (seconds < 60):
                formatedTime = seconds + " seconds";
                break;

                case (seconds > 60 && seconds < 3600):
                formatedTime = Math.floor(seconds / 60) + " minutes";
                break;

                case (seconds > 3600 && seconds < 86400):
                formatedTime = Math.floor(seconds / 3600) + " hours";
                break;

                case (seconds > 86400):
                formatedTime = Math.floor(seconds / 86400) + " days";
                break;
        }

        return formatedTime;

        })();


        var newPost = app.template.cloneNode(true);

        newPost.removeAttribute('id' , 'post-template');

        newPost.querySelector('.order').textContent = order;
        newPost.querySelector('.score').textContent = score;
        newPost.querySelector('.title').textContent = title;
        newPost.querySelector('.title').href = post.data.url
        newPost.querySelector('.domain').textContent = domain;
        newPost.querySelector('.author').textContent = author;
        newPost.querySelector('.sub').textContent = sub;
        newPost.querySelector('time').textContent = time;
        newPost.querySelector('.comment-num').textContent = comments_num;

        clone.append(newPost);

    }


//checks whether the app is loading or not
//if it's loading the spinner is dsiplayed
//if it's finished loading spinner is hidden
    app.isLoading = function isLoading(isLoading){

      if(!isLoading){
        document.querySelector('.loading').style.display = "none";
      }else{
        document.querySelector('.loading').style.display = "block";
      }
    }


//attach events to the UI ELements

nav.addEventListener('click', function(e){
  var target = e.target;

  if(target.nodeName === 'A'){
    e.preventDefault();
    var href = target.getAttribute('href')
    app.url = href.replace('#', "");
    app.fetch(app.url);

    nav.querySelector('.tabbed').classList.remove('tabbed');
    target.classList.add('tabbed');
  }
})


//intial load
app.fetch(app.url);







  }



















})();
