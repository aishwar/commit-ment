(function () {

"use strict";

var Cache = {
  // Independently cache them - because we want the users cache to always contains the whole repo list,
  // If just 1 repo for a user was queried for and we added that to the users cache. The repo list in it would
  // no longer be trustable as an indicator of the whole repo list of the user.
  users:[],
  repos:[]
}

var User = {
  getRepos: function (name, callback) {
    $.getJSON("https://api.github.com/users/" + name + "/repos?callback=?", function (data) {
      if (data.meta.status == 200)
      {
        Cache.users[name] = { repos:data.data }
        callback.call(null, data.data)
        return
      }
    });
  }
}

var Repo = {
  getCommits: function (username, reponame, callback) {
    $.getJSON("https://api.github.com/repos/" + username + "/" + reponame + "/commits?callback=?", function (data) {
      var userRepos = Cache.repos[username] = Cache.repos[username] || {}
      
      if (data.meta && data.meta.status == 200)
      {
        userRepos[reponame] = { changesets:data.data }
      }
      else
      {
        userRepos[reponame] = {}
      }
      
      callback.call(null, data.data)
    });
  }
}

var UserRepos = {
  getCommitDataFor: function (username, callback) {
    
    User.getRepos(username, function (repos) {
      var processData = _.after(repos.length, function () {
        var commits = UserRepos.processData(username)
        callback.call(null, commits)
      })
      
      for (var i = 0; i < repos.length; i++)
      {
        Repo.getCommits(username, repos[i].name, processData)
      }
    })
    
  },
  
  processData: function (username) {
    var repos = Cache.users[username].repos
    var allCommits = []
    
    for (var i = 0; i < repos.length; i++)
    {
      var repo = repos[i]
      var changesets = Cache.repos[username][repo.name].changesets
      
      changesets = _.map(changesets, function (changeset) {
        var commit = null
        var date = null
        
        if (changeset.author && changeset.author.login == username)
        {
          date = changeset.commit.author.date
          
          commit = {
              username  : username
            , reponame  : repo.name
            , date      : new Date(date)
          }
        }
        
        return commit
      });
      
      changesets = _.compact(changesets)
      allCommits = allCommits.concat(changesets)
    }
    
    return allCommits;
  }
}

window.$Github = {
  getCommitDataFor: function (username, callback) {
    UserRepos.getCommitDataFor(username, callback)
  }
}

}())