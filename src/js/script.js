const body = $("body")

$(".button-expand").on("click", () => {
  body.addClass("video-expand");
});

$(".button-close").on("click", () => {
  body.removeClass("video-expand");
});