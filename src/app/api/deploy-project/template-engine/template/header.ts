import { HeaderParams } from '../../types'
import { DEFAULT_CONTENT } from '../../constants'

/**
 * Generate static header HTML
 */
export function generateStaticHeader({ content, themeParams }: HeaderParams): string {
	const getTypographyStyles = () => {
		return {
			fontFamily: themeParams?.typography?.fontFamily || 'ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
			fontSize: themeParams?.typography?.fontSize || '16px',
			lineHeight: themeParams?.typography?.lineHeight || '1.6',
			fontWeight: themeParams?.typography?.fontWeight || '400',
		}
	}

	const getBorderRadiusClass = () => {
		switch (themeParams?.layout?.borderRadius) {
			case 'none':
				return '0'
			case 'small':
				return '0.125rem'
			case 'large':
				return '0.5rem'
			case 'medium':
			default:
				return '0.375rem'
		}
	}

	const getButtonStyles = (variant: 'outline' | 'premium' = 'outline') => {
		const baseStyles = {
			fontFamily: themeParams?.typography?.fontFamily || 'ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
			fontSize: themeParams?.typography?.fontSize || '16px',
			fontWeight: themeParams?.typography?.fontWeight || '400',
		}

		if (variant === 'outline') {
			return {
				...baseStyles,
				borderColor: themeParams?.colors?.border || themeParams?.colors?.primary,
				color: content?.textColor || themeParams?.colors?.text,
				borderRadius: themeParams?.components?.button?.rounded ? '9999px' : getBorderRadiusClass(),
			} as React.CSSProperties
		}

		return {
			...baseStyles,
			backgroundColor: themeParams?.colors?.accent,
			color: themeParams?.colors?.text,
			borderRadius: themeParams?.components?.button?.rounded ? '9999px' : getBorderRadiusClass(),
		} as React.CSSProperties
	}

	// Get logo size
	const getLogoSize = () => {
		switch (content?.logoSize) {
			case 'small':
				return { width: '2rem', height: '2rem', iconSize: '1.25rem' }
			case 'large':
				return { width: '5rem', height: '5rem', iconSize: '2.5rem' }
			case 'xlarge':
				return { width: '6rem', height: '6rem', iconSize: '3rem' }
			case 'medium':
			default:
				return { width: '4rem', height: '4rem', iconSize: '2rem' }
		}
	}

	const typographyStyles = getTypographyStyles()
	const borderRadius = getBorderRadiusClass()
	const outlineButtonStyles = getButtonStyles('outline')
	const premiumButtonStyles = getButtonStyles('premium')
	const logoSize = getLogoSize()

	// Xử lý navigation từ content
	const navigation: Array<{ name: string; href: string }> = content?.navigation || [
		{ name: 'Trang chủ', href: '#home' },
		{ name: 'Về chúng tôi', href: '#about' },
		{ name: 'Sản phẩm', href: '#products' },
		{ name: 'Tài nguyên', href: '#resources' },
		{ name: 'Liên hệ', href: '#contact' }
	]

	// Xử lý social links từ content (để sử dụng trong tương lai)
	// const socialLinks: Array<{ platform: string; url: string; icon?: string }> = content?.socialLinks || []

	return `<header style="
		background-color: ${content?.colorMode === 'custom' && content?.backgroundColor 
			? content.backgroundColor 
			: themeParams?.sections?.header?.backgroundColor || themeParams?.colors?.secondary || '#D2691E'}; 
		color: ${content?.textColor || themeParams?.sections?.header?.textColor || themeParams?.colors?.text || '#ffffff'};
		border-bottom: 1px solid ${content?.colorMode === 'custom' && content?.primaryColor 
			? content.primaryColor 
			: themeParams?.colors?.border || themeParams?.colors?.primary || '#8B4513'};
		position: sticky;
		top: 0;
		z-index: 50;
		box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
		border-radius: ${borderRadius};
		font-family: ${typographyStyles.fontFamily};
		font-size: ${typographyStyles.fontSize};
		line-height: ${typographyStyles.lineHeight};
		font-weight: ${typographyStyles.fontWeight};
	">
		<div style="
			max-width: ${themeParams?.layout?.containerWidth || '1200px'}; 
			margin: 0 auto; 
			padding: 1rem;
		">
			<div style="display: flex; align-items: center; justify-content: space-between;">
				<!-- Logo -->
				<div style="display: flex; align-items: center; gap: 0.75rem;">
					${content?.logo ? `
						<div style="position: relative; width: ${logoSize.width}; height: ${logoSize.height};">
							<img src="${content.logo}" alt="Logo" style="
								width: 100%; 
								height: 100%; 
								object-fit: contain; 
								border-radius: ${borderRadius};
							" />
						</div>
					` : `
						<div style="
							width: ${logoSize.width}; 
							height: ${logoSize.height}; 
							display: flex; 
							align-items: center; 
							justify-content: center; 
							background-color: ${themeParams?.colors?.accent || '#CD853F'};
							border-radius: ${borderRadius};
						">
							<!-- Lucide: Coffee -->
							<svg style="width: ${logoSize.iconSize}; height: ${logoSize.iconSize}; color: white;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
								<path d="M17 8h1a4 4 0 1 1 0 8h-1"/>
								<path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/>
								<line x1="6" x2="6" y1="2" y2="4"/>
								<line x1="10" x2="10" y1="2" y2="4"/>
								<line x1="14" x2="14" y1="2" y2="4"/>
							</svg>
						</div>
					`}
					<div>
						<h1 style="
							color: ${content?.textColor || themeParams?.sections?.header?.textColor || themeParams?.colors?.text || '#ffffff'};
							font-size: ${themeParams?.typography?.headingSize === '2xl' ? '1.5rem' : 
										 themeParams?.typography?.headingSize === 'xl' ? '1.25rem' : '1.125rem'};
							font-weight: ${themeParams?.typography?.fontWeight || '700'};
							margin: 0;
						">
							${content?.title || DEFAULT_CONTENT.COMPANY_NAME}
						</h1>
						<p style="
							color: ${content?.textColor || themeParams?.sections?.header?.textColor || themeParams?.colors?.text || '#ffffff'};
							font-size: ${themeParams?.typography?.bodySize === 'sm' ? '0.875rem' : '0.75rem'};
							opacity: 0.8;
							margin: 0;
						">
							${content?.subtitle || DEFAULT_CONTENT.COMPANY_SUBTITLE}
						</p>
					</div>
				</div>

				<!-- Desktop Navigation -->
				<nav class="desktop-nav" style="display: none; align-items: center; gap: 2rem;">
					${navigation.map(item => `
						<a href="${item.href}" style="
							color: ${content?.textColor || themeParams?.sections?.header?.textColor || themeParams?.colors?.text || '#ffffff'};
							text-decoration: none;
							font-size: ${typographyStyles.fontSize};
							transition: opacity 0.2s;
							font-weight: 500;
						" onmouseover="this.style.opacity='0.8'" onmouseout="this.style.opacity='1'">
							${item.name}
						</a>
					`).join('')}
				</nav>

				<!-- Desktop CTAs -->
				<div class="desktop-ctas" style="display: none; align-items: center; gap: 0.75rem;">
					<button style="
						background: transparent;
						border: 1px solid ${outlineButtonStyles.borderColor};
						color: ${outlineButtonStyles.color};
						padding: 0.5rem 1rem;
						border-radius: ${outlineButtonStyles.borderRadius};
						font-family: ${outlineButtonStyles.fontFamily};
						font-size: ${outlineButtonStyles.fontSize};
						font-weight: ${outlineButtonStyles.fontWeight};
						cursor: pointer;
						display: flex;
						align-items: center;
						gap: 0.5rem;
						transition: all 0.2s;
					" onmouseover="this.style.opacity='0.8'" onmouseout="this.style.opacity='1'">
						<!-- Lucide: Download -->
						<svg style="width: 1rem; height: 1rem;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
							<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
							<polyline points="7 10 12 15 17 10"/>
							<line x1="12" x2="12" y1="15" y2="3"/>
						</svg>
						Cẩm nang XNK 2025
					</button>
					<button style="
						background-color: ${content?.colorMode === 'custom' && content?.primaryColor 
							? content.primaryColor 
							: themeParams?.colors?.primary || '#8B4513'};
						color: ${content?.textColor || themeParams?.sections?.header?.textColor || themeParams?.colors?.text || '#ffffff'};
						border: none;
						padding: 0.5rem 1rem;
						border-radius: ${premiumButtonStyles.borderRadius};
						font-family: ${premiumButtonStyles.fontFamily};
						font-size: ${premiumButtonStyles.fontSize};
						font-weight: ${premiumButtonStyles.fontWeight};
						cursor: pointer;
						display: flex;
						align-items: center;
						gap: 0.5rem;
						transition: all 0.2s;
					" onmouseover="this.style.backgroundColor='${themeParams?.colors?.secondary || '#D2691E'}'" onmouseout="this.style.backgroundColor='${content?.colorMode === 'custom' && content?.primaryColor ? content.primaryColor : themeParams?.colors?.primary || '#8B4513'}'">
						<!-- Lucide: Phone -->
						<svg style="width: 1rem; height: 1rem;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
							<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
						</svg>
						Tư vấn miễn phí
					</button>
				</div>

				<!-- Mobile Menu Button -->
				<button class="mobile-menu-btn" style="
					background: transparent;
					border: none;
					color: ${content?.textColor || themeParams?.sections?.header?.textColor || themeParams?.colors?.text || '#ffffff'};
					font-family: ${typographyStyles.fontFamily};
					font-size: ${typographyStyles.fontSize};
					font-weight: ${typographyStyles.fontWeight};
					cursor: pointer;
					padding: 0.5rem;
					display: block;
				" onclick="toggleMobileMenu()">
					<!-- Lucide: Menu -->
					<svg style="width: 1.25rem; height: 1.25rem;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
						<line x1="4" x2="20" y1="6" y2="6"/>
						<line x1="4" x2="20" y1="12" y2="12"/>
						<line x1="4" x2="20" y1="18" y2="18"/>
					</svg>
				</button>
			</div>

			<!-- Mobile Menu Overlay -->
			<div id="mobileMenuOverlay" style="
				display: none;
				position: fixed;
				top: 0;
				left: 0;
				width: 100vw;
				height: 100vh;
				background-color: rgba(0, 0, 0, 0.5);
				z-index: 999;
			" onclick="toggleMobileMenu()"></div>

			<!-- Mobile Menu -->
			<div id="mobileMenu" style="
				display: none;
				position: fixed;
				top: 0;
				right: 0;
				width: 320px;
				height: 100vh;
				background-color: ${content?.colorMode === 'custom' && content?.backgroundColor 
					? content.backgroundColor 
					: themeParams?.sections?.header?.backgroundColor || themeParams?.colors?.secondary || '#D2691E'};
				border-left: 1px solid ${content?.colorMode === 'custom' && content?.primaryColor 
					? content.primaryColor 
					: themeParams?.colors?.border || themeParams?.colors?.primary || '#8B4513'};
				padding: 2rem 1rem;
				z-index: 1000;
				font-family: ${typographyStyles.fontFamily};
				font-size: ${typographyStyles.fontSize};
				font-weight: ${typographyStyles.fontWeight};
				overflow-y: auto;
			">
				<!-- Close Button -->
				<button style="
					position: absolute;
					top: 1rem;
					right: 1rem;
					background: transparent;
					border: none;
					color: ${content?.textColor || themeParams?.sections?.header?.textColor || themeParams?.colors?.text || '#ffffff'};
					cursor: pointer;
					padding: 0.5rem;
				" onclick="toggleMobileMenu()">
					<svg style="width: 1.25rem; height: 1.25rem;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<line x1="18" x2="6" y1="6" y2="18"/>
						<line x1="6" x2="18" y1="6" y2="18"/>
					</svg>
				</button>
				
				<div style="display: flex; flex-direction: column; gap: 1rem; margin-top: 2rem;">
					<nav style="display: flex; flex-direction: column; gap: 1rem;">
						${navigation.map(item => `
							<a href="${item.href}" style="
								color: ${content?.textColor || themeParams?.sections?.header?.textColor || themeParams?.colors?.text || '#ffffff'};
								text-decoration: none;
								font-size: 1.125rem;
								font-weight: 500;
								padding: 0.5rem 0;
								transition: opacity 0.2s;
								display: block;
							" onmouseover="this.style.opacity='0.8'" onmouseout="this.style.opacity='1'" onclick="toggleMobileMenu()">
								${item.name}
							</a>
						`).join('')}
					</nav>
					<div style="
						display: flex;
						flex-direction: column;
						gap: 0.75rem;
						padding-top: 1rem;
						border-top: 1px solid ${content?.colorMode === 'custom' && content?.primaryColor 
							? content.primaryColor 
							: themeParams?.colors?.border || themeParams?.colors?.primary || '#8B4513'};
					">
					<button style="
						background: transparent;
						border: 1px solid ${outlineButtonStyles.borderColor};
						color: ${outlineButtonStyles.color};
						padding: 0.5rem 1rem;
						border-radius: ${outlineButtonStyles.borderRadius};
						font-family: ${outlineButtonStyles.fontFamily};
						font-size: ${outlineButtonStyles.fontSize};
						font-weight: ${outlineButtonStyles.fontWeight};
						cursor: pointer;
						display: flex;
						align-items: center;
						gap: 0.5rem;
						transition: all 0.2s;
						width: 100%;
					" onmouseover="this.style.opacity='0.8'" onmouseout="this.style.opacity='1'">
						<!-- Lucide: Download -->
						<svg style="width: 1rem; height: 1rem;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
							<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
							<polyline points="7 10 12 15 17 10"/>
							<line x1="12" x2="12" y1="15" y2="3"/>
						</svg>
						Cẩm nang XNK 2025
					</button>
					<button style="
						background-color: ${content?.colorMode === 'custom' && content?.primaryColor 
							? content.primaryColor 
							: themeParams?.colors?.primary || '#8B4513'};
						color: ${content?.textColor || themeParams?.sections?.header?.textColor || themeParams?.colors?.text || '#ffffff'};
						border: none;
						padding: 0.5rem 1rem;
						border-radius: ${premiumButtonStyles.borderRadius};
						font-family: ${premiumButtonStyles.fontFamily};
						font-size: ${premiumButtonStyles.fontSize};
						font-weight: ${premiumButtonStyles.fontWeight};
						cursor: pointer;
						display: flex;
						align-items: center;
						gap: 0.5rem;
						transition: all 0.2s;
						width: 100%;
					" onmouseover="this.style.backgroundColor='${themeParams?.colors?.secondary || '#D2691E'}'" onmouseout="this.style.backgroundColor='${content?.colorMode === 'custom' && content?.primaryColor ? content.primaryColor : themeParams?.colors?.primary || '#8B4513'}'">
						<!-- Lucide: Phone -->
						<svg style="width: 1rem; height: 1rem;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
							<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
						</svg>
						Tư vấn miễn phí
					</button>
				</div>
			</div>
		</div>
	</header>

	<style>
		/* Responsive styles to match Header.tsx */
		@media (min-width: 768px) {
			.desktop-nav {
				display: flex !important;
			}
			.desktop-ctas {
				display: flex !important;
			}
			.mobile-menu-btn {
				display: none !important;
			}
		}
		
		@media (max-width: 767px) {
			.desktop-nav {
				display: none !important;
			}
			.desktop-ctas {
				display: none !important;
			}
			.mobile-menu-btn {
				display: block !important;
			}
		}
	</style>

	<script>
		function toggleMobileMenu() {
			const menu = document.getElementById('mobileMenu');
			const overlay = document.getElementById('mobileMenuOverlay');
			if (menu.style.display === 'none' || menu.style.display === '') {
				menu.style.display = 'block';
				overlay.style.display = 'block';
				document.body.style.overflow = 'hidden';
			} else {
				menu.style.display = 'none';
				overlay.style.display = 'none';
				document.body.style.overflow = 'auto';
			}
		}

		// Show desktop navigation on larger screens
		function updateNavigation() {
			const desktopNav = document.querySelector('.desktop-nav');
			const desktopCTAs = document.querySelector('.desktop-ctas');
			const mobileButton = document.querySelector('.mobile-menu-btn');
			
			// Check screen size using CSS media query approach
			const isDesktop = window.matchMedia('(min-width: 768px)').matches;
			if (isDesktop) {
				if (desktopNav) desktopNav.style.display = 'flex';
				if (desktopCTAs) desktopCTAs.style.display = 'flex';
				if (mobileButton) mobileButton.style.display = 'none';
			} else {
				if (desktopNav) desktopNav.style.display = 'none';
				if (desktopCTAs) desktopCTAs.style.display = 'none';
				if (mobileButton) mobileButton.style.display = 'block';
			}
		}

		// Initialize and listen for resize
		updateNavigation();
		window.addEventListener('resize', updateNavigation);
	</script>`
}
