let page = 0;
	const pageSize = 4,
		top_news = document.querySelector('.tops-news-container'),
		btn_menu = document.querySelector('a[class="btn-menu"]'),
		btn_more_stories = document.querySelector('.btn_view_more_stories'),
		apikey = 'vuM6FbVmJFnbpjj53hcCsV28EHmVkl97', // TODO: Migrate to a environment file
		btn_close = document.querySelector('button[class="btn-close"]'),
		nav = document.querySelector('nav'),
		welcome = document.querySelector('.welcome'),
		title_top_news = document.querySelector('.title-top-news'),
		contact_form = document.querySelector('#contact-form'),
		modal = document.getElementById('modal'),
		modal_close = document.getElementsByClassName('close')[0],
		modal_name = document.getElementById('modal_name'),
		modal_email = document.getElementById('modal_email'),
		modal_phone_number = document.getElementById('modal_phone_number'),
		modal_description = document.getElementById('modal_description'),
		news_template = (urlToImage, title, content, link) => {
			const article = document.createElement('article');
			const anchor = document.createElement('a');
			const container = document.createElement('div');
			const content_img = document.createElement('div');
			const img = document.createElement('img');
			const title_h3 = document.createElement('h3');
			const content_p = document.createElement('p');
			container.classList.add('news-item');
			content_img.classList.add('news-item-image');
			anchor.classList.add('news-item-a');
			title_h3.textContent = title;
			content_p.textContent = content;
			img.src = urlToImage ? urlToImage : './assets/images/img-not-found.png';
			anchor.href = link;
			anchor.target = '_blank';
			article.setAttribute('tabindex', '0');
			content_img.appendChild(img);
			container.appendChild(content_img);
			container.appendChild(title_h3);
			container.appendChild(content_p);
			anchor.appendChild(container);
			article.appendChild(anchor);
			return article;
		},
		viewMoreStories = async () => {
			try {
				const response = await fetch(
					`https://api.nytimes.com/svc/topstories/v2/science.json?api-key=${apikey}`,
					{
						method: 'GET',
					}
				);
				const { results } = await response.json();
				const articles = results.slice(page * pageSize, page * pageSize + 4);
				articles.forEach((article) => {
					const { multimedia, title, abstract: content, url } = article;
					const template = news_template(
						multimedia[0].url,
						title,
						content,
						url
					);
					top_news.appendChild(template);
				});
				page++;
			} catch (error) {
				console.log(error);
			}
		},
		[
			first_name_input,
			last_name_input,
			email_input,
			phone_number_input,
			description_input,
			checkbox_input,
		] = contact_form;
	function required_field_validation(e) {
		const errorDiv = e.srcElement.parentNode.children[2];
		if (!e.srcElement.validity.valid) {
			errorDiv.classList.replace('error-disable', 'error-enable');
		} else {
			errorDiv.classList.replace('error-enable', 'error-disable');
		}
	}
	function checkbox_field_validation(e) {
		const errorDiv = e.srcElement.parentNode.children[1];
		if (!e.srcElement.validity.valid) {
			errorDiv.classList.replace('error-disable', 'error-enable');
		} else {
			errorDiv.classList.replace('error-enable', 'error-disable');
		}
	}
	function email_field_validation(e) {
		const errorRequiredDiv = e.srcElement.parentNode.children[2];
		const errorFormatDiv = e.srcElement.parentNode.children[3];
		if (!e.srcElement.validity.valid) {
			errorRequiredDiv.classList.replace('error-disable', 'error-enable');
			errorFormatDiv.classList.replace('error-enable', 'error-disable');
		} else {
			errorRequiredDiv.classList.replace('error-enable', 'error-disable');
			if (/\S+@\S+\.\S+/.test(e.srcElement.value)) {
				errorFormatDiv.classList.replace('error-enable', 'error-disable');
			} else {
				errorFormatDiv.classList.replace('error-disable', 'error-enable');
			}
		}
	}
	function phone_field_validation(e) {
		const errorRequiredDiv = e.srcElement.parentNode.children[2];
		const errorFormatDiv = e.srcElement.parentNode.children[3];
		if (!e.srcElement.validity.valid) {
			errorRequiredDiv.classList.replace('error-disable', 'error-enable');
			errorFormatDiv.classList.replace('error-enable', 'error-disable');
		} else {
			errorRequiredDiv.classList.replace('error-enable', 'error-disable');
			if (
				/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s/0-9]*$/.test(e.srcElement.value)
			) {
				errorFormatDiv.classList.replace('error-enable', 'error-disable');
			} else {
				errorFormatDiv.classList.replace('error-disable', 'error-enable');
			}
		}
	}
	// Events listeners
	first_name_input.addEventListener('input', required_field_validation);
	last_name_input.addEventListener('input', required_field_validation);
	email_input.addEventListener('input', email_field_validation);
	phone_number_input.addEventListener('input', phone_field_validation);
	description_input.addEventListener('input', required_field_validation);
	checkbox_input.addEventListener('input', checkbox_field_validation);
	btn_menu.addEventListener('click', () => nav.classList.toggle('nav-active'));
	//   TODO: Dismiss content with animation
	btn_close.addEventListener('click', function () {
		title_top_news.classList.add('title-top-news-without-welcome-section');
		welcome.classList.add('welcome-inactive');
	});
	btn_more_stories.addEventListener('click', viewMoreStories);
	modal_close.addEventListener('click', () => (modal.style.display = 'none'));
	contact_form.addEventListener('submit', (e) => {
		e.preventDefault();
		// Validation regex with: https://regex101.com/
        // https://www.w3resource.com/javascript/form/email-validation.php
        const reg_email =/\S+@\S+\.\S+/
		if (reg_email.test(email_input.value)
		) {
            // https://www.w3resource.com/javascript/form/phone-no-validation.php
            const reg_phone = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s/0-9]*$/
			if (reg_phone.test(phone_number_input.value)
			) {
				modal.style.display = 'block';
				modal_name.textContent = `${first_name_input.value} ${last_name_input.value}`;
				modal_email.textContent = email_input.value;
				modal_phone_number.textContent = phone_number_input.value;
				modal_description.textContent = description_input.value;
			} else {
				phone_number_input.setCustomValidity('Phone number is not valid!');
			}
		} else {
			email_input.setCustomValidity('Email is not valid!');
		}
	});
	viewMoreStories();