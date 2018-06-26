class initPage {
	constructor() {
		window.addEventListener('DOMContentLoaded', this.getDataPage.bind(this), true);
		window.openEditHost = this.openEditHost.bind(this);
		this.dataForm = document.querySelector('[data-hosts]');
		this.dataFormEdit = document.querySelector('[data-hosts-edit]');


		let envSelect = document.querySelectorAll('#envSelect button');
		envSelect.forEach(elm => {
			elm.addEventListener('click', this.setEnviroment.bind(this));
		});

		let saveButton = document.querySelector('[data-save=host]');
		saveButton.addEventListener('click', this.putHosts.bind(this));

		let editButton = document.querySelector('[data-save=edit]');
		editButton.addEventListener('click', this.editHosts.bind(this));

		let removeButton = document.querySelector('[data-remove=edit]');
		removeButton.addEventListener('click', this.removeHosts.bind(this));


	}

	editHosts(e) {
		let id = this.dataFormEdit.id.value;
		let env = this.dataFormEdit.env.value;
		let ip = this.dataFormEdit.ip.value;
		let host = this.dataFormEdit.host.value;

		id = id.replace(env, '');

		if (id, env, ip, host) {
			fetch(`/api/envdata/${env}/${id}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					ip,
					host,
					comment: ''
				})
			}).then(resp => {
				return resp.json();
			}).then(resp => {
				if (!resp.error) {
					$('#editHost').modal('hide');
					this.getDataPage();
				} else {
					console.error('Não foi possivel salvar');
				}
				this.dataForm.reset();
			});
		} else {
			console.error('Falta campos');
		}
	}

	removeHosts(e) {
		let id = this.dataFormEdit.id.value;
		let env = this.dataFormEdit.env.value;

		id = id.replace(env, '');

		if (id, env) {
			fetch(`/api/envdata/${env}/${id}`, {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json'
				}
			}).then(resp => {
				return resp.json();
			}).then(resp => {
				if (!resp.error) {
					$('#editHost').modal('hide');
					this.getDataPage();
				} else {
					console.error('Não foi possivel deletar');
				}
				this.dataForm.reset();
			});
		} else {
			console.error('Falta campos');
		}
	}

	putHosts() {
		let env = this.dataForm.env.value;
		let ip = this.dataForm.ip.value;
		let host = this.dataForm.host.value;

		if (env, ip, host) {
			fetch(`/api/envdata/${env}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					ip,
					host,
					comment: ''
				})
			}).then(resp => {
				return resp.json();
			}).then(resp => {
				if (!resp.error) {
					$('#putHost').modal('hide');
					this.getDataPage();
				} else {
					console.error('Não foi possivel salvar');
				}
				this.dataForm.reset();
			});
		} else {
			console.error('Falta campos');
		}
	}

	openEditHost(e) {
		let container = e.target.parentNode.parentNode;

		let data = this.getRowData(container);

		let inputsEnv = document.querySelectorAll('#inputState2 option');
		inputsEnv.forEach(input => {
			if (input.value == data.env) {
				input.selected = true;
			} else {
				input.selected = false;
			}
		})

		let inputId = document.querySelector('#inputId');
		inputId.value = data.id;

		let inputHost = document.querySelector('#inputHost2');
		inputHost.value = data.ip;

		let inputAddress = document.querySelector('#inputAddress2');
		inputAddress.value = data.host;

		$('#editHost').modal('show');
	}

	getRowData(row) {
		let itens = row.querySelectorAll('div');

		return {
			id: row.id,
			env: itens[0].innerHTML,
			host: itens[1].innerHTML,
			ip: itens[2].innerHTML
		}
	}

	getDataPage() {
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

			let hostContainer = document.querySelector('#hosts');
			hostContainer.innerHTML = '';
			fetch(`/api/envdata/local`).then(resp => {
				return resp.json();
			}).then(resp => {
				if (!resp.error) {
					resp.forEach((item, id) => {
						this.setHostItem({
							id: `local${id}`,
							env: 'local',
							ip: item.ip,
							host: item.host
						}, hostContainer);
					})
				}

				fetch(`/api/envdata/${env}`).then(resp => {
					return resp.json();
				}).then(resp => {
					if (!resp.error) {
						resp.forEach((item, id) => {
							this.setHostItem({
								id: `${env}${id}`,
								env,
								ip: item.ip,
								host: item.host
							}, hostContainer);
						})
					}
				});

			});
		});
	}

	setHostItem(info, hostContainer) {
		let hostBase = document.querySelector('#hostBase').cloneNode(true);
		hostBase.id = info.id;

		let hostBaseItens = hostBase.querySelectorAll('div');

		hostBaseItens[0].innerHTML = info.env
		hostBaseItens[1].innerHTML = info.ip
		hostBaseItens[2].innerHTML = info.host

		hostContainer.appendChild(hostBase);
	}

	setEnviroment(e) {
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
				this.getDataPage();
			}
		})
	}
}

export default new initPage;
