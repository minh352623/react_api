
export default async (request, context) => {
    const url = new URL(request.url)
    const path = url.pathname;
    
    // Get the page content.
    const response = await context.next();
    const res=  await fetch(`https://shoppet.site/api/seo?path=${path}`);
    const data = await res.json(); 
    return  new Response(data.content,response)
   
};

export const config = {
  path: "/seo",
};