let init = (function init(window, document){
	window.addEventListener('DOMContentLoaded', getDataPage, true);

	let envSelect = document.querySelectorAll('#envSelect button');
	envSelect.forEach(elm => {
		elm.addEventListener('click', setEnviroment);
	});

})(window, document)

function getDataPage() {
	fetch('/api/localdata').then(resp => {
		return resp.json();
	}).then(resp => {
		let envSelect = document.querySelectorAll('#envSelect button');
		let env = resp.env;

		envSelect.forEach(elm => {
			let value = elm.value;

			if (value == env) {
				elm.classList.add('active');
			} else {
				elm.classList.remove('active');
			}
		});

		fetch(`/api/envdata/${env}`).then(resp => {
			return resp.json();
		}).then(resp => {
			let hostContainer = document.querySelector('#hosts');
			if (!resp.error) {
				resp.forEach(item => {
					let hostBase = document.querySelector('#hostBase').cloneNode(true);
					hostBase.id = '';

					let hostBaseItens = hostBase.querySelectorAll('div');

					hostBaseItens[0].innerHTML = env
					hostBaseItens[1].innerHTML = item.ip
					hostBaseItens[2].innerHTML = item.host

					hostContainer.appendChild(hostBase);
				})
			} else {
				hostContainer.innerHTML = '';
			}
		})
	});
}

function setEnviroment(e) {
	let env = e.target.value;

	fetch('/api/localdata', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			env
		})
	}).then(resp => {
		return resp.json();
	}).then(resp => {
		if (!resp.error) {
			getDataPage();
		}
	})
}


export default init;
