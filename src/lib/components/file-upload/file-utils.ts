/** Port of the `@zag-js/file-utils` helpers the file upload machine needs. */
export type FileError =
	| 'TOO_MANY_FILES'
	| 'FILE_INVALID_TYPE'
	| 'FILE_TOO_LARGE'
	| 'FILE_TOO_SMALL'
	| 'FILE_INVALID'
	| 'FILE_EXISTS'
	| (string & {});

export type FileMimeType = string;

export type FileAccept = string | string[] | Record<string, string[]>;

const mimeTypes =
	'3g2_video/3gpp2[3gp,3gpp_video/3gpp[3mf_model/3mf[7z_application/x-7z-compressed[aac_audio/aac[ac_application/pkix-attr-cert[adp_audio/adpcm[adts_audio/aac[ai_application/postscript[aml_application/automationml-aml+xml[amlx_application/automationml-amlx+zip[amr_audio/amr[apk_application/vnd.android.package-archive[apng_image/apng[appcache,manifest_text/cache-manifest[appinstaller_application/appinstaller[appx_application/appx[appxbundle_application/appxbundle[asc_application/pgp-keys[atom_application/atom+xml[atomcat_application/atomcat+xml[atomdeleted_application/atomdeleted+xml[atomsvc_application/atomsvc+xml[au,snd_audio/basic[avi_video/x-msvideo[avci_image/avci[avcs_image/avcs[avif_image/avif[aw_application/applixware[bdoc_application/bdoc[bin,bpk,buffer,deb,deploy,dist,distz,dll,dmg,dms,dump,elc,exe,img,iso,lrf,mar,msi,msm,msp,pkg,so_application/octet-stream[bmp,dib_image/bmp[btf,btif_image/prs.btif[bz2_application/x-bzip2[c_text/x-c[ccxml_application/ccxml+xml[cdfx_application/cdfx+xml[cdmia_application/cdmi-capability[cdmic_application/cdmi-container[cdmid_application/cdmi-domain[cdmio_application/cdmi-object[cdmiq_application/cdmi-queue[cer_application/pkix-cert[cgm_image/cgm[cjs_application/node[class_application/java-vm[coffee,litcoffee_text/coffeescript[conf,def,in,ini,list,log,text,txt_text/plain[cpp,cxx,cc_text/x-c++src[cpl_application/cpl+xml[cpt_application/mac-compactpro[crl_application/pkix-crl[css_text/css[csv_text/csv[cu_application/cu-seeme[cwl_application/cwl[cww_application/prs.cww[davmount_application/davmount+xml[dbk_application/docbook+xml[doc_application/msword[docx_application/vnd.openxmlformats-officedocument.wordprocessingml.document[dsc_text/prs.lines.tag[dssc_application/dssc+der[dtd_application/xml-dtd[dwd_application/atsc-dwd+xml[ear,jar,war_application/java-archive[ecma_application/ecmascript[emf_image/emf[eml,mime_message/rfc822[emma_application/emma+xml[emotionml_application/emotionml+xml[eot_application/vnd.ms-fontobject[eps,ps_application/postscript[epub_application/epub+zip[exi_application/exi[exp_application/express[exr_image/aces[ez_application/andrew-inset[fdf_application/fdf[fdt_application/fdt+xml[fits_image/fits[flac_audio/flac[flv_video/x-flv[g3_image/g3fax[geojson_application/geo+json[gif_image/gif[glb_model/gltf-binary[gltf_model/gltf+json[gml_application/gml+xml[go_text/x-go[gpx_application/gpx+xml[gz_application/gzip[h_text/x-h[h261_video/h261[h263_video/h263[h264_video/h264[heic_image/heic[heics_image/heic-sequence[heif_image/heif[heifs_image/heif-sequence[htm,html,shtml_text/html[ico_image/x-icon[icns_image/x-icns[ics,ifb_text/calendar[iges,igs_model/iges[ink,inkml_application/inkml+xml[ipa_application/octet-stream[java_text/x-java-source[jp2,jpg2_image/jp2[jpeg,jpe,jpg_image/jpeg[jpf,jpx_image/jpx[jpm,jpgm_image/jpm[jpgv_video/jpeg[jph_image/jph[js,mjs_text/javascript[json_application/json[json5_application/json5[jsonld_application/ld+json[jsx_text/jsx[jxl_image/jxl[jxr_image/jxr[ktx_image/ktx[ktx2_image/ktx2[less_text/less[m1v,m2v,mpe,mpeg,mpg_video/mpeg[m4a_audio/mp4[m4v_video/x-m4v[md,markdown_text/markdown[mid,midi,kar,rmi_audio/midi[mkv_video/x-matroska[mp2,mp2a,mp3,mpga,m3a,m2a_audio/mpeg[mp4,mp4v,mpg4_video/mp4[mp4a_audio/mp4[mp4s,m4p_application/mp4[odp_application/vnd.oasis.opendocument.presentation[oda_application/oda[ods_application/vnd.oasis.opendocument.spreadsheet[odt_application/vnd.oasis.opendocument.text[oga,ogg,opus,spx_audio/ogg[ogv_video/ogg[ogx_application/ogg[otf_font/otf[p12,pfx_application/x-pkcs12[pdf_application/pdf[pem_application/x-pem-file[php_text/x-php[png_image/png[ppt_application/vnd.ms-powerpoint[pptx_application/vnd.openxmlformats-officedocument.presentationml.presentation[pskcxml_application/pskc+xml[psd_image/vnd.adobe.photoshop[py_text/x-python[qt,mov_video/quicktime[rar_application/vnd.rar[rdf_application/rdf+xml[rtf_text/rtf[sass_text/x-sass[scss_text/x-scss[sgm,sgml_text/sgml[sh_application/x-sh[svg,svgz_image/svg+xml[swf_application/x-shockwave-flash[tar_application/x-tar[tif,tiff_image/tiff[toml_application/toml[ts_video/mp2t[tsx_text/tsx[tsv_text/tab-separated-values[ttc_font/collection[ttf_font/ttf[vtt_text/vtt[wasm_application/wasm[wav_audio/wav[weba_audio/webm[webm_video/webm[webmanifest_application/manifest+json[webp_image/webp[wma_audio/x-ms-wma[wmv_video/x-ms-wmv[woff_font/woff[woff2_font/woff2[xls_application/vnd.ms-excel[xlsx_application/vnd.openxmlformats-officedocument.spreadsheetml.sheet[xml_application/xml[xz_application/x-xz[yaml,yml_text/yaml[zip_application/zip';

export const mimeTypesMap = new Map<string, string>(
	mimeTypes.split('[').flatMap((entry) => {
		const [extensions, mimeType] = entry.split('_');
		return extensions.split(',').map((extension) => [extension, mimeType] as [string, string]);
	})
);

export function getFileMimeType(name: string): string | null {
	const extension = name.split('.').pop()?.toLowerCase();
	return extension ? (mimeTypesMap.get(extension) ?? null) : null;
}

function isMIMEType(value: string) {
	return (
		value === 'audio/*' ||
		value === 'video/*' ||
		value === 'image/*' ||
		value === 'text/*' ||
		/\w+\/[-+.\w]+/g.test(value)
	);
}

function isExtension(value: string) {
	return /^.*\.[\w]+$/.test(value);
}

const isValidMIME = (value: string) => isMIMEType(value) || isExtension(value);

/** The `accept` attribute string Zag writes on the hidden input. */
export function getAcceptAttrString(accept: FileAccept | undefined): string | undefined {
	if (accept == null) return undefined;
	if (typeof accept === 'string') return accept;
	if (Array.isArray(accept)) return accept.filter(isValidMIME).join(',');
	return Object.entries(accept)
		.reduce<string[]>((acc, [mimeType, extensions]) => [...acc, mimeType, ...extensions], [])
		.filter(isValidMIME)
		.join(',');
}

interface AcceptMatchers {
	extensions: string[];
	baseMimes: string[];
	mimes: string[];
}

function parseAccept(accept: string | undefined): AcceptMatchers | null {
	if (!accept) return null;
	const types = accept.split(',');
	const matchers: AcceptMatchers = { extensions: [], baseMimes: [], mimes: [] };
	for (const type of types) {
		const validType = type.trim().toLowerCase();
		if (validType.charAt(0) === '.') matchers.extensions.push(validType);
		else if (validType.endsWith('/*')) matchers.baseMimes.push(validType.slice(0, validType.indexOf('/')));
		else matchers.mimes.push(validType);
	}
	if (!matchers.extensions.length && !matchers.baseMimes.length && !matchers.mimes.length) {
		return null;
	}
	return matchers;
}

function matches(matchers: AcceptMatchers, file: File): boolean {
	const fileName = file.name || '';
	const mimeType = (file.type || getFileMimeType(fileName) || '').toLowerCase();
	if (matchers.mimes.includes(mimeType)) return true;
	if (matchers.baseMimes.length) {
		const slash = mimeType.indexOf('/');
		if (matchers.baseMimes.includes(slash === -1 ? mimeType : mimeType.slice(0, slash))) return true;
	}
	if (matchers.extensions.length) {
		const lowerName = fileName.toLowerCase();
		if (matchers.extensions.some((extension) => lowerName.endsWith(extension))) return true;
	}
	return false;
}

export type FileTypeValidator = (file: File) => [boolean, FileError | null];

/** Parses `accept` once and returns a validator, so many files do not re-parse it. */
export function createFileTypeValidator(accept: string | undefined): FileTypeValidator {
	const matchers = parseAccept(accept);
	return (file) => {
		const isAcceptable =
			file.type === 'application/x-moz-file' || !matchers || matches(matchers, file);
		return [isAcceptable, isAcceptable ? null : 'FILE_INVALID_TYPE'];
	};
}

export function isValidFileType(file: File, accept?: string): [boolean, FileError | null] {
	return createFileTypeValidator(accept)(file);
}

export function isValidFileSize(
	file: File,
	minSize?: number,
	maxSize?: number
): [boolean, FileError | null] {
	if (file.size != null) {
		if (minSize != null && maxSize != null) {
			if (file.size > maxSize) return [false, 'FILE_TOO_LARGE'];
			if (file.size < minSize) return [false, 'FILE_TOO_SMALL'];
		} else if (minSize != null && file.size < minSize) return [false, 'FILE_TOO_SMALL'];
		else if (maxSize != null && file.size > maxSize) return [false, 'FILE_TOO_LARGE'];
	}
	return [true, null];
}

export function isFileEqual(file1: File, file2: File): boolean {
	return file1.name === file2.name && file1.size === file2.size && file1.type === file2.type;
}

export function getFileKey(file: File): string {
	return `${file.name}|${file.size}|${file.type}`;
}

export function getTotalFileSize(files: File[]): number {
	return files.reduce((acc, file) => acc + file.size, 0);
}

export function getFileDataUrl(file: File): Promise<string | undefined> {
	const reader = new FileReader();
	return new Promise((resolve, reject) => {
		reader.onerror = () => {
			reader.abort();
			reject(new Error('There was an error reading a file'));
		};
		reader.onloadend = () => {
			const { result } = reader;
			if (result instanceof ArrayBuffer) {
				reject(new Error('Expected DataURL as string from Blob/File, got ArrayBuffer'));
			} else resolve(result || undefined);
		};
		reader.readAsDataURL(file);
	});
}

/** `Intl` byte formatting, matching Zag's `formatBytes`. */
export function formatBytes(size: number, locale?: string): string {
	const units = ['byte', 'kilobyte', 'megabyte', 'gigabyte', 'terabyte', 'petabyte'] as const;
	let value = Math.abs(size);
	let unit = 0;
	while (value >= 1024 && unit < units.length - 1) {
		value /= 1024;
		unit++;
	}
	return new Intl.NumberFormat(locale, {
		style: 'unit',
		unit: units[unit],
		unitDisplay: 'short'
	}).format(value);
}

interface FileSystemEntryLike {
	isDirectory: boolean;
	isFile: boolean;
	name: string;
	createReader?: () => FileSystemDirectoryReaderLike;
	file?: (callback: (file: File) => void) => void;
}

interface FileSystemDirectoryReaderLike {
	readEntries: (callback: (entries: FileSystemEntryLike[]) => void) => void;
}

interface DataTransferItemLike {
	kind: string;
	getAsFile?: () => File | null;
	getAsEntry?: () => FileSystemEntryLike | null;
	webkitGetAsEntry?: () => FileSystemEntryLike | null;
}

function getItemEntry(item: DataTransferItemLike): FileSystemEntryLike | null {
	if (typeof item.getAsEntry === 'function') return item.getAsEntry();
	if (typeof item.webkitGetAsEntry === 'function') return item.webkitGetAsEntry();
	return null;
}

function addRelativePath(file: File, path: string): File {
	Object.defineProperty(file, 'relativePath', { value: path ? `${path}/${file.name}` : file.name });
	return file;
}

function getDirectoryFiles(
	reader: FileSystemDirectoryReaderLike,
	path = ''
): Promise<File[]> {
	return new Promise((resolve) => {
		const pending: Promise<File[]>[] = [];
		const readDirectoryEntries = () => {
			reader.readEntries((entries) => {
				if (entries.length === 0) {
					void Promise.all(pending).then((results) => resolve(results.flat()));
					return;
				}
				const promises = entries
					.map((entry): Promise<File[]> | null => {
						if (!entry) return null;
						if (entry.isDirectory && entry.createReader) {
							return getDirectoryFiles(entry.createReader(), `${path}${entry.name}`);
						}
						if (entry.isFile && entry.file) {
							return new Promise<File[]>((done) => {
								entry.file?.((file) => done([addRelativePath(file, path)]));
							});
						}
						return null;
					})
					.filter((entry): entry is Promise<File[]> => entry !== null);
				pending.push(Promise.all(promises).then((results) => results.flat()));
				readDirectoryEntries();
			});
		};
		readDirectoryEntries();
	});
}

/**
 * Resolves dropped or pasted files, optionally walking dropped directories. Falls back to
 * `getAsFile()` when the item exposes no entry object, which also keeps synthetic drops usable.
 */
export function getFileEntries(
	items: ArrayLike<DataTransferItemLike> | null | undefined,
	traverseDirectories?: boolean
): Promise<File[]> {
	const resolvers = Array.from(items ?? [])
		.filter((item) => item.kind === 'file')
		.map((item): Promise<File[]> | null => {
			const entry = getItemEntry(item);
			if (!entry) {
				const file = item.getAsFile?.();
				return file ? Promise.resolve([addRelativePath(file, '')]) : null;
			}
			if (entry.isDirectory && traverseDirectories && entry.createReader) {
				return getDirectoryFiles(entry.createReader(), entry.name);
			}
			if (entry.isFile && typeof item.getAsFile === 'function') {
				const file = item.getAsFile();
				return Promise.resolve(file ? [addRelativePath(file, '')] : []);
			}
			if (entry.isFile && entry.file) {
				return new Promise<File[]>((resolve) => {
					entry.file?.((file) => resolve([addRelativePath(file, '')]));
				});
			}
			return null;
		})
		.filter((resolver): resolver is Promise<File[]> => resolver !== null);
	return Promise.all(resolvers).then((results) => results.flat());
}
