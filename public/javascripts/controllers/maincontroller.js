app.controller('MainCtrl',[
  '$scope',
  'posts',
  function($scope,posts){


    $scope.posts = posts.posts;

    $scope.addPost = function() {
      if(!$scope.title || $scope.title === '') {return;}
      posts.create({
        title: $scope.title,
        link: $scope.link
       });
      $scope.title = '';
      $scope.link = '';

    };

    $scope.upvote = function(post) {
      posts.upvote(post);
    };

    $scope.downvote = function(post){
      posts.downvote(post);
    }
  }]);
