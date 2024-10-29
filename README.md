A couple of things to note:

1. I use TypeScript for the component to match Autarc’s infrastructure.
2. I use absolutely minimal css, my focus was on the component logic instead.
3. Users are able to delete only the comments made by themselves, they can’t remove comments made by other team members. Users can however freely comment and reply to each others’ comments. The behavior is similar to how Slack works.
4. Only single nesting is possible, a reply can’t have another reply - similar to Slack as well
5. For the persistency I use browser’s local storage, this can also be replaced with any kind of local database or native ios solution
6. I added way too many comments just explain my thought process behind each decision. I figured it’s better if I comment too much than not enough.
