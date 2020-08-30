export default class View {
	constructor(props) {
		this.props = props
		this.render = this.render.bind(this)
	}

	setState(state) {
		this.state = state

		this._element.dispatchEvent(new Event('view.change'))
	}

	static render(element, container) {
		const dom =
			element.type === 'TEXT_ELEMENT'
				? document.createTextNode('')
				: document.createElement(element.type)

		const isProperty = key => key !== 'children'

		Object.keys(element.props)
			.filter(isProperty)
			.forEach(name => {
				dom[name] = element.props[name]
			})

		element.props.children.forEach(child => View.render(child, dom))

		container.appendChild(dom)

		if (element._reactive) {
			element._view._element = dom
			dom.addEventListener('view.change', e => {
				container.removeChild(dom)

				let newElement = element._view.render()
				newElement._reactive = true
				newElement._view = element._view

				View.render(newElement, container)
			})
		}
	}

	static createElement(type, props, ...children) {
		if (typeof type === 'function' && View.isPrototypeOf(type)) {
			const vm = new type({ ...props, children })
			let element = vm.render()
			element._reactive = true
			element._view = vm
			return element
		} else if (typeof type === 'function') {
			const element = type({
				...props,
				children: children.map(child =>
					typeof child === 'object'
						? child
						: View.createTextElement(child)
				)
			})
			element.props.children = element.props.children[0]
			return element
		} else {
			return {
				type,
				props: {
					...props,
					children: children.map(child =>
						typeof child === 'object'
							? child
							: View.createTextElement(child)
					)
				}
			}
		}
	}

	static createTextElement(text) {
		return {
			type: 'TEXT_ELEMENT',
			props: {
				nodeValue: text,
				children: []
			}
		}
	}
}
