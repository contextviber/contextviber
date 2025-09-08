import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Simple password protection middleware (Optional)
// To enable: Set NEXT_PUBLIC_SITE_PASSWORD in .env.local
export function middleware(request: NextRequest) {
  // Skip middleware if no password is set
  const sitePassword = process.env.NEXT_PUBLIC_SITE_PASSWORD
  if (!sitePassword) {
    return NextResponse.next()
  }

  // Skip for API routes and static files
  if (
    request.nextUrl.pathname.startsWith('/api') ||
    request.nextUrl.pathname.startsWith('/_next') ||
    request.nextUrl.pathname.startsWith('/favicon.ico')
  ) {
    return NextResponse.next()
  }

  // Check for auth cookie
  const authCookie = request.cookies.get('contextviber_auth')
  
  // If already authenticated, continue
  if (authCookie?.value === sitePassword) {
    return NextResponse.next()
  }

  // Check for password in query params (for initial auth)
  const { searchParams } = request.nextUrl
  const password = searchParams.get('password')

  if (password === sitePassword) {
    // Set auth cookie and redirect without password in URL
    const response = NextResponse.redirect(
      new URL(request.nextUrl.pathname, request.url)
    )
    response.cookies.set('contextviber_auth', sitePassword, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })
    return response
  }

  // Show password prompt page
  return new NextResponse(
    `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>ContextViber - Access Required</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
          }
          .container {
            background: white;
            border-radius: 16px;
            padding: 40px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            max-width: 400px;
            width: 100%;
          }
          h1 {
            color: #333;
            margin-bottom: 10px;
            font-size: 28px;
          }
          p {
            color: #666;
            margin-bottom: 30px;
            font-size: 14px;
          }
          form {
            display: flex;
            flex-direction: column;
          }
          input {
            padding: 12px 16px;
            border: 2px solid #e0e0e0;
            border-radius: 8px;
            font-size: 16px;
            transition: border-color 0.3s;
            margin-bottom: 16px;
          }
          input:focus {
            outline: none;
            border-color: #667eea;
          }
          button {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: transform 0.2s, box-shadow 0.3s;
          }
          button:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(102, 126, 234, 0.4);
          }
          .logo {
            font-size: 40px;
            margin-bottom: 20px;
            text-align: center;
          }
          .error {
            color: #f44336;
            font-size: 14px;
            margin-top: 10px;
            display: none;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo">🚀</div>
          <h1>ContextViber</h1>
          <p>This site is protected. Please enter the access password to continue.</p>
          <form onsubmit="handleSubmit(event)">
            <input 
              type="password" 
              id="password" 
              placeholder="Enter password" 
              required
              autofocus
            />
            <button type="submit">Access Site</button>
            <div class="error" id="error">Incorrect password. Please try again.</div>
          </form>
        </div>
        <script>
          function handleSubmit(e) {
            e.preventDefault();
            const password = document.getElementById('password').value;
            const currentUrl = new URL(window.location.href);
            currentUrl.searchParams.set('password', password);
            window.location.href = currentUrl.toString();
          }
          
          // Check if there was an error (password was wrong)
          const urlParams = new URLSearchParams(window.location.search);
          if (urlParams.has('password')) {
            document.getElementById('error').style.display = 'block';
            // Clean up URL
            window.history.replaceState({}, document.title, window.location.pathname);
          }
        </script>
      </body>
    </html>
    `,
    {
      status: 200,
      headers: { 'Content-Type': 'text/html' },
    }
  )
}

// Configure which routes to protect
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}