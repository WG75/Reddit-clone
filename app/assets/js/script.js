(function(){

  "use strict";

//listen for the dom and when it's loaded excute fun (excuteCode)
  document.addEventListener('DOMContentLoaded', excuteCode);


  function excuteCode(){

    var postsHolder = document.querySelector('.posts-container');
    var nav = document.querySelector('.main-nav');
    var dropdown = document.querySelector('.dropdown');
    var dropdownMenu = document.querySelector('.dropdown-menu')
    var menuIcon = document.querySelector('.menu-icon')
    var navItems = document.querySelector('.nav-items')
    var search = document.querySelector('.search')
    var currentPostsContainer;

//app object that'll contain all functions.
    var app = {
      url: 'hot',
      template: document.querySelector('#post-template').cloneNode(true),
    }


//make a call to reddit api using snoocore
    app.fetch = function(url){
//display the loader
      app.isLoading(true);

//select the posts container and remove all children nodes
      currentPostsContainer = document.querySelector('.posts');
      currentPostsContainer.innerHTML = "";

//clone the posts container so when looping over the posts
//this cloned node will append each post so instead of minpulating
//the dom for each post we'll only minpulate it once.
      var postsClone = currentPostsContainer.cloneNode(true);

//checks if the call is sent to unallowed end-point if so it
//returns from the function and display an error image to the user.
      if(url == 'glided' ||
        url == 'promoted'||
        url == 'wiki'    ||
        url == 'rising')
      {
        postsClone.innerHTML = "<img class='error' src='assets/img/reddit-broke.jpg'>"
        postsHolder.replaceChild(postsClone, currentPostsContainer);
        app.isLoading(false);
        return;
      }

//making the call to the api and loop over the returned data
//for each turn in the loop we call the app.buildPosts function
//and pass 3 arguments (currentpost - index - clonedNode).
        reddit('/' + url).get().then(function(data){
          var posts = data.data.children;
          for(var i = 0; i < posts.length; i++){
            app.buildPosts(posts[i], i, postsClone);
          }

//replace the current posts container with the clonedNode that contains posts.
          postsHolder.replaceChild(postsClone, currentPostsContainer);

//hide the loader.
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
        newPost.querySelector('.title').textContent = title;
        newPost.querySelector('.title').href = post.data.url
        newPost.querySelector('.domain').textContent = "(" + domain + ")";
        newPost.querySelector('.author').textContent = author;
        newPost.querySelector('.sub').textContent = sub;
        newPost.querySelector('time').textContent = time;



        if(comments_num > 0){
          newPost.querySelector('.comment-num').textContent = comments_num;
        }else{
          newPost.querySelector('.comment-num').textContent = "";
        }


        switch(true){
          case score < 2:
          newPost.querySelector('.score').textContent = "";
          newPost.querySelector('.score').classList.add('zero');
          break;

          case score >= 10000:
          newPost.querySelector('.score').textContent = (score/1000).toFixed(1) + "k";
          break;

          default:
          newPost.querySelector('.score').textContent = score;
        }


        if(thumb != 'self'){

          switch(thumb){
            case 'default':
            newPost.querySelector('.thumb').classList.add('default')
            break;

            case 'image':
            newPost.querySelector('.thumb').classList.add('image')
            break;

            default:
              newPost.querySelector('.thumb').style.background = 'url(' + thumb + ')';
          }

          }


        switch(expand){
          case 'selftext':
          newPost.querySelector('.post-content').textContent = post.data.selftext;
          break;

          case 'video':
          newPost.querySelector('.post-content').innerHTML = "<img src=" + post.data.media.oembed.thumbnail_url + ">";
          newPost.querySelector('.post-content').style.border = "none";
          newPost.querySelector('.expand').classList.add('video');
          break;

          case null:
          newPost.querySelector('.post-content').remove();
          newPost.querySelector('.expand').remove();
        }

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

dropdown.addEventListener('click', function(e){
  e.preventDefault()
  dropdownMenu.classList.toggle('open')
})

menuIcon.addEventListener('click', function(){
  navItems.classList.toggle('expand')
})

search.addEventListener('click', function(){
  document.querySelector('aside').classList.toggle('sidebar-isOpen')
})

postsHolder.addEventListener('click', function(e){
  var target = e.target;

  if(target.classList.contains('expand')){
    target.classList.toggle('close');
    target.parentNode.nextElementSibling.classList.toggle('is-collapsed');
  }

})


//intial load
app.fetch(app.url);

}



















})();
