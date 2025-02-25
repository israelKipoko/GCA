<div>
    <div class="block">
		<div class="box">
			<p class="number">
				<span class="num">80</span>
				<span class="sub">%</span>
			</p>
			<p class="title">HTML</p>
		</div>
		<span class="dots"></span>
		<svg class="svg">
			<defs>
				<linearGradient id="gradientStyle">
					<stop offset="0%" stop-color="#565656" />
					<stop offset="100%" stop-color="#b7b5b5" />
				</linearGradient>
			</defs>
			<circle class="circle" cx="90" cy="90" r="60" />
		</svg>
	</div>
</div>

@push('js')
    <script>
        const block = document.querySelectorAll('.block');
window.addEventListener('load', function(){
  block.forEach(item => {
    let numElement = item.querySelector('.num');
    let num = parseInt(numElement.innerText);
    let count = 0;
    let time = 2000 / num;
    let circle = item.querySelector('.circle');
    setInterval(() => {
      if(count == num){
        clearInterval();
      } else {
        count += 1;
        numElement.innerText = count;
      }
    }, time)
    circle.style.strokeDashoffset 
      = 503 - ( 503 * ( num / 100 ));
    let dots = item.querySelector('.dots');
    dots.style.transform = 
      `rotate(${360 * (num / 100)}deg)`;
    if(num == 100){
      dots.style.opacity = 0;
    }
  })
});
    </script>
@endpush