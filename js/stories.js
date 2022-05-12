"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">
      <span class='star' data-id='${story.storyId}' data-favorited='false'>&star;</span> 
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <span class="rm-story"><small >&#128465;</small></span>
        <small class="story-user">posted by ${story.username}</small>
      
      </li>
    `);
}

function generateFavoritedStoryMarkup(story) {
  const hostName = story.getHostName();
  return $(`
    <li id="${story.storyId}">
    <span class='star' data-id='${story.storyId}' data-favorited='true'>&starf;</span> 
      <a href="${story.url}" target="a_blank" class="story-link">
        ${story.title}
      </a>
      <small class="story-hostname">(${hostName})</small>
      <small class="story-author">by ${story.author}</small>
      <span class="rm-story"><small >&#128465;</small></span>
      <small class="story-user">posted by ${story.username}</small>
    
    </li>
  `)
}

function generateOwnStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();

  return $(`
      <li id="${story.storyId}">
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <span class='rm-user-story'><small>&#128465;</small></span>
        <small class="story-user">posted by ${story.username}</small>
        <small>THIS IS MY OWN STORY!!!</small>
      </li>
    `);
}


/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

/** adds news story based on user form submit */
async function addStorySubmit(e) {
    if (e.target.tagName === 'BUTTON') {
      let author = $('#author').val(); 
      let title = $('#title').val(); 
      let url = $('#url').val(); 
 
      let userStoryProps = {author, title, url};

      // adds new story to global storyList
      let newStory = await storyList.addStory(currentUser, userStoryProps)
      // creates a version to be used in DOM
      let addedStory = new Story(userStoryProps)
      // adds the story to current user own stories array
      currentUser.ownStories.push(addedStory)
      let markup = generateStoryMarkup(addedStory);
      $allStoriesList.prepend(markup);
    
      
      // userStoryProps = {};
    }

}

$addStoryForm.on('click', addStorySubmit)

// event listener for any clicks on favorite star in allStoriesList ol and trashcan in allStoriesList ol

$('ol').on('click', (e)=> {
   currentUser.removeStory(e);
   currentUser.checkAndMarkFavorite(e);
})

