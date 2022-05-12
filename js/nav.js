"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/* Hide Nav components based on Logged In status
*/
function hideNavComponents()  {
  $userNavLinks.hide();
}

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
  $userNavLinks.show();
}
// Handles actions in the nav bar that relate to user and story interactions
function handleMainNavClicks (evt) {
  evt.preventDefault()
  if (evt.target.classList.contains('my-stories')) {
    console.log('MY STORIES CLICKED')
    console.log(evt.target);
    hidePageComponents(); 
    $allStoriesList.empty();

    // loop through all of our stories and generate HTML for them
    for (let story of currentUser.ownStories) {
      const $story = generateOwnStoryMarkup(story);
      $allStoriesList.append($story);
 
    }
    $allStoriesList.show();
  }

  if (evt.target.classList.contains('favorites')) {
    console.log('FAVES CLICKED')
    console.log(evt.target);
    hidePageComponents();
    $allStoriesList.empty();
    for (let faveStory of currentUser.favorites) {
      let markup = generateFavoritedStoryMarkup(faveStory);

      $allStoriesList.prepend(markup);
    }
    $allStoriesList.show()
  }

  if (evt.target.classList.contains('add-a-story')) {
    console.log('ADD STORY CLICKED')
    console.log(evt.target);
    /** show or hide story form form based on user click */
    for (let button of $userNavLinks) {
      if (button.classList.contains('hidden')) {
        button.classList.remove('hidden')
        $addStoryForm.show();
  }
  else if (!button.classList.contains('hidden')) {
    button.classList.add('hidden')
    $addStoryForm.hide();
  }
    }
  }
 
}


$userNavLinks.on('click', handleMainNavClicks)