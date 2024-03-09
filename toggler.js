let normalToggler = false;
addEventListener("DOMContentLoaded", (event) => {

  const outlineToggler = document.getElementById('outline-toggle-div');
  const outlineToggleSlider = outlineToggler.querySelector('.outline-toggle-slider');
  const toggler = document.getElementById('toggle-div');


  outlineToggler.addEventListener('click', () => {

    normalToggler = !normalToggler;
    if(normalToggler){
      outlineToggleSlider.style.left = '56%';
      outlineToggler.style.borderColor = 'green'
      outlineToggleSlider.style.background = 'green';
      toggler.style.color = 'green';
    } else {
      outlineToggleSlider.style.left = '0';
      outlineToggleSlider.style.background = 'red';
      outlineToggler.style.borderColor = 'red'
      toggler.style.color = 'red';
    }
  });
});