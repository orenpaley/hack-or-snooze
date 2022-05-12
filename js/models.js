"use strict";

const BASE_URL = "https://hack-or-snooze-v3.herokuapp.com";

/******************************************************************************
 * Story: a single story in the system
 */

class Story {

  /** Make instance of Story from data object about story:
   *   - {title, author, url, username, storyId, createdAt}
   */

  constructor({ storyId, title, author, url, username, createdAt }) {
    this.storyId = storyId;
    this.title = title;
    this.author = author;
    this.url = url;
    this.username = username;
    this.createdAt = createdAt;
  }

  /** Parses hostname out of URL and returns it. */

  getHostName() {
    return this.url;
  }
}


/******************************************************************************
 * List of Story instances: used by UI to show story lists in DOM.
 */

class StoryList {
  constructor(stories) {
    this.stories = stories;
  }

  /** Generate a new StoryList. It:
   *
   *  - calls the API
   *  - builds an array of Story instances
   *  - makes a single StoryList instance out of that
   *  - returns the StoryList instance.
   */

  static async getStories() {
    // Note presence of `static` keyword: this indicates that getStories is
    //  **not** an instance method. Rather, it is a method that is called on the
    //  class directly. Why doesn't it make sense for getStories to be an
    //  instance method?

    // because we have no need to 'get' the api except for here AND now it 
    // can call on itself to do something for it self
    // IE get the api story list data and return it back for more use
    // in getStories class

    // query the /stories endpoint (no auth required)
    const response = await axios({
      url: `${BASE_URL}/stories`,
      method: "GET",
    });

    // turn plain old story objects from API into instances of Story class
    const stories = response.data.stories.map(story => new Story(story));

    // build an instance of our own class using the new array of stories
    return new StoryList(stories);
  }

  /** Adds story data to API, makes a Story instance, adds it to story list.
   * - user - the current instance of User who will post the story
   * - obj of {title, author, url}
   *
   * Returns the new Story instance
   */

  async addStory(user, newStory) {
    // UNIMPLEMENTED: complete this function!
    const post = await axios({
      method: 'POST',
      url: `${BASE_URL}/stories`,
      data: {
        token: `${user.loginToken}`,
        story: { 
          author: `${newStory.author}`,
          title: `${newStory.title}`, 
          url: `${newStory.url}`
        }}
    });
    // adding a story
    // create object to hold fetched data
    // add to global 'stories' 
    // add to user stories list
    // return a story using data from axios 

    this.stories.unshift(post)
    console.log(post.data)
    return post.data //post.data is correct here
   
  }
  
}


/******************************************************************************
 * User: a user in the system (only used to represent the current user)
 */

class User {
  /** Make user instance from obj of user data and a token:
   *   - {username, name, createdAt, favorites[], ownStories[]}
   *   - token
   */

  constructor({
                username,
                name,
                createdAt,
                favorites = [],
                ownStories = []
              },
              token) {
    this.username = username;
    this.name = name;
    this.createdAt = createdAt;

    // instantiate Story instances for the user's favorites and ownStories
    this.favorites = favorites.map(s => new Story(s));
    this.ownStories = ownStories.map(s => new Story(s));

    // store the login token on the user so it's easy to find for API calls.
    this.loginToken = token;
  }

  /** Register new user in API, make User instance & return it.
   *
   * - username: a new username
   * - password: a new password
   * - name: the user's full name
   */

  static async signup(username, password, name) {
    const response = await axios({
      url: `${BASE_URL}/signup`,
      method: "POST",
      data: { user: { username, password, name } },
    });

    let { user } = response.data

    return new User(
      {
        username: user.username,
        name: user.name,
        createdAt: user.createdAt,
        favorites: user.favorites,
        ownStories: user.stories
      },
      response.data.token
    );
  }

  /** Login in user with API, make User instance & return it.

   * - username: an existing user's username
   * - password: an existing user's password
   */

  static async login(username, password) {
    const response = await axios({
      url: `${BASE_URL}/login`,
      method: "POST",
      data: { user: { username, password } },
    });

    let { user } = response.data;

    return new User(
      {
        username: user.username,
        name: user.name,
        createdAt: user.createdAt,
        favorites: user.favorites,
        ownStories: user.stories
      },
      response.data.token
    );
  }

  /** When we already have credentials (token & username) for a user,
   *   we can log them in automatically. This function does that.
   */

  static async loginViaStoredCredentials(token, username) {
    try {
      const response = await axios({
        url: `${BASE_URL}/users/${username}`,
        method: "GET",
        params: { token },
      });

      let { user } = response.data;

      return new User(
        {
          username: user.username,
          name: user.name,
          createdAt: user.createdAt,
          favorites: user.favorites,
          ownStories: user.stories
        },
        token
      );
    } catch (err) {
      console.error("loginViaStoredCredentials failed", err);
      return null;
    }
  }

// when a star is clicked, checks if that story is a favorite of the user 
// then adds or removes from currentUser.favorites accordingly
  async checkAndMarkFavorite(e) {
    if (e.target.classList.contains('star')) {
      console.log('star clicked')
       // user must click on star for these actions to be performed
       let storyStar = e.target;
   // added to api favorites
        if (storyStar.dataset.favorited === 'false') {
      // sends POST request to API to add selected story to favorites
      try { 
        await axios({
          method: 'POST',
          url: `https://hack-or-snooze-v3.herokuapp.com/users/${currentUser.username}/favorites/${storyStar.dataset.id}`,
          data: {
            token: currentUser.loginToken
          }
        })
      }
      catch {throw new Error}
      

        // changes appearance of star to mimick favoriting the story
        storyStar.innerHTML = '&starf;'
        // sets status of story to favorited
        storyStar.dataset.favorited = 'true';
      }
      // if selected story data-favorited is true...
        else {
          await axios({
            method: 'DELETE',
            url: `https://hack-or-snooze-v3.herokuapp.com/users/${currentUser.username}/favorites/${storyStar.dataset.id}`,
            data: {
              token: `${currentUser.loginToken}`,
            }});
          storyStar.innerHTML = '&star;'
           // sets status of story to favorited
          storyStar.dataset.favorited = 'false';
        }
      }
    }
  

  async removeStory(e) {
    let evt = e.target.parentElement;
    if (evt.classList.contains('rm-story') || 
    evt.classList.contains('rm-user-story')) {
      let storyIdToRemove = evt.parentElement.id;

      if (evt.classList.contains('rm-story'))  {
        
        let stories = storyList.stories;
           // console.log('storyListId', story.storyId)
      // finds index of item in storyList to remove
        let index = stories.findIndex((story) => {
        return story.storyId === storyIdToRemove;
      });
      stories.splice(index,1);
      evt.parentElement.remove();
    
      await axios({
        method: 'DELETE',
        url: `https://hack-or-snooze-v3.herokuapp.com/stories/${storyIdToRemove}`,
        data: {
          token: `${currentUser.loginToken}`,
        }
      });
      }

      if (e.target.parentElement.classList.contains('rm-user-story')) {
      let userStories = currentUser.ownStories;
        console.log('removing User Story');
        let index = userStories.findIndex((story) => {
          return userStories.storyId === storyIdToRemove;
       });
       userStories.splice(index, 1);
       evt.parentElement.remove();
    }
  }
  }
}
