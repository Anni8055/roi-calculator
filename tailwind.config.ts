import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		fontFamily: {
			sans: ['Inter', 'system-ui', 'sans-serif'],
			mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			backgroundImage: {
				'gradient-primary': 'var(--gradient-primary)',
				'gradient-accent': 'var(--gradient-accent)', 
				'gradient-subtle': 'var(--gradient-subtle)',
				'gradient-bg': 'var(--gradient-bg)',
				'gradient-card': 'var(--gradient-card)',
				'gradient-text': 'var(--gradient-text)',
				'gradient-radial': 'var(--gradient-radial)',
				'gradient-conic': 'var(--gradient-conic)',
			},
			boxShadow: {
				'elegant': 'var(--shadow-elegant)',
				'card': 'var(--shadow-card)',
				'glow': 'var(--shadow-glow)',
				'premium': 'var(--shadow-premium)',
				'input': 'var(--shadow-input)',
				'soft': 'var(--shadow-soft)',
				'strong': 'var(--shadow-strong)',
			},
			transitionProperty: {
				'smooth': 'var(--transition-smooth)',
				'spring': 'var(--transition-spring)',
				'bounce': 'var(--transition-bounce)',
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
				'2xl': '1rem',
				'3xl': '1.5rem',
			},
			spacing: {
				'18': '4.5rem',
				'88': '22rem',
				'128': '32rem',
			},
			fontSize: {
				'2xs': ['0.625rem', { lineHeight: '0.75rem' }],
				'3xl': ['1.875rem', { lineHeight: '2.25rem' }],
				'4xl': ['2.25rem', { lineHeight: '2.5rem' }],
				'5xl': ['3rem', { lineHeight: '1' }],
				'6xl': ['3.75rem', { lineHeight: '1' }],
				'7xl': ['4.5rem', { lineHeight: '1' }],
				'8xl': ['6rem', { lineHeight: '1' }],
				'9xl': ['8rem', { lineHeight: '1' }],
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'fade-in': {
					'0%': {
						opacity: '0',
						transform: 'translateY(10px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'scale-in': {
					'0%': {
						transform: 'scale(0.95)',
						opacity: '0'
					},
					'100%': {
						transform: 'scale(1)',
						opacity: '1'
					}
				},
				'progress': {
					'0%': { width: '0%' },
					'100%': { width: '100%' }
				},
				'slide-up': {
					'0%': {
						opacity: '0',
						transform: 'translateY(30px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'slide-down': {
					'0%': {
						opacity: '0',
						transform: 'translateY(-30px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'slide-left': {
					'0%': {
						opacity: '0',
						transform: 'translateX(30px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateX(0)'
					}
				},
				'slide-right': {
					'0%': {
						opacity: '0',
						transform: 'translateX(-30px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateX(0)'
					}
				},
				'float': {
					'0%, 100%': {
						transform: 'translateY(0px)'
					},
					'50%': {
						transform: 'translateY(-20px)'
					}
				},
				'shimmer': {
					'0%': {
						backgroundPosition: '-200% 0'
					},
					'100%': {
						backgroundPosition: '200% 0'
					}
				},
				'pulse-slow': {
					'0%, 100%': {
						opacity: '1'
					},
					'50%': {
						opacity: '0.5'
					}
				},
				'bounce-slow': {
					'0%, 100%': {
						transform: 'translateY(0)'
					},
					'50%': {
						transform: 'translateY(-10px)'
					}
				},
				'wiggle': {
					'0%, 100%': {
						transform: 'rotate(-3deg)'
					},
					'50%': {
						transform: 'rotate(3deg)'
					}
				},
				'gradient-x': {
					'0%, 100%': {
						backgroundPosition: '0% 50%'
					},
					'50%': {
						backgroundPosition: '100% 50%'
					}
				},
				'gradient-y': {
					'0%, 100%': {
						backgroundPosition: '50% 0%'
					},
					'50%': {
						backgroundPosition: '50% 100%'
					}
				},
				'gradient-xy': {
					'0%, 100%': {
						backgroundPosition: '0% 0%'
					},
					'25%': {
						backgroundPosition: '100% 0%'
					},
					'50%': {
						backgroundPosition: '100% 100%'
					},
					'75%': {
						backgroundPosition: '0% 100%'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.5s ease-out',
				'scale-in': 'scale-in 0.3s ease-out',
				'progress': 'progress 2s ease-in-out',
				'slide-up': 'slide-up 0.5s ease-out',
				'slide-down': 'slide-down 0.5s ease-out',
				'slide-left': 'slide-left 0.5s ease-out',
				'slide-right': 'slide-right 0.5s ease-out',
				'float': 'float 6s ease-in-out infinite',
				'shimmer': 'shimmer 2s infinite',
				'pulse-slow': 'pulse-slow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
				'bounce-slow': 'bounce-slow 3s infinite',
				'wiggle': 'wiggle 1s ease-in-out infinite',
				'gradient-x': 'gradient-x 15s ease infinite',
				'gradient-y': 'gradient-y 15s ease infinite',
				'gradient-xy': 'gradient-xy 15s ease infinite',
			},
			backdropBlur: {
				xs: '2px',
			},
			scale: {
				'102': '1.02',
				'103': '1.03',
				'105': '1.05',
			},
			rotate: {
				'1': '1deg',
				'2': '2deg',
				'3': '3deg',
				'6': '6deg',
			},
			zIndex: {
				'60': '60',
				'70': '70',
				'80': '80',
				'90': '90',
				'100': '100',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
