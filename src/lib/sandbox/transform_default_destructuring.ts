export function code_transform_default_destructuring(code: string) {
  const with_no_default_destructuring = `let{HTMLElement}=globalThis;if(!HTMLElement){HTMLElement=class{}}`;
  const pattern =
    /const\s*{\s*HTMLElement\s*=\s*class\s*{\s*}\s*}\s*=\s*globalThis\s*;/;

  let result = code;

  if (pattern.test(result)) {
    result = result.replace(pattern, with_no_default_destructuring);
  }

  return result;
}
