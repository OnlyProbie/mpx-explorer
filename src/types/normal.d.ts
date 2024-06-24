interface RenderOptions {
  props: HeadOption[];
  tsType: string[];
  slots: string[];
  events: string[];
  methods: string[] | HeadOption[];
  computed: string[];
  mixIns: string[];
  data: string[];
  watch: string[];
  externalClasses: string[];
  name?: string;
}