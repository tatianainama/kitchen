/* eslint-disable max-lines-per-function */
import { Button, ButtonGroup } from '@/components/Button';
import { Checkbox, Chip, ChipGroup, Radio, TextInput, Textarea } from '@/components/Forms';
import Heart from '@/components/Icon/heart';
import Layout from 'components/Layout';
import { Subtitle } from '@/components/Typography';

export default function Home () {

  return (
    <Layout>
      <div style={{ margin: '16px 0' }}>
        <Subtitle>Buttons</Subtitle>
        <ButtonGroup>
          <Button>Default</Button>
          <Button color="primary">Primary</Button>
          <Button color="secondary">Secondary</Button>
          <Button color="outline">outline</Button>
        </ButtonGroup>
        <ButtonGroup>
          <Button disabled>Default</Button>
          <Button disabled color="primary">Primary</Button>
          <Button disabled color="secondary">Secondary</Button>
          <Button disabled color="outline">outline</Button>
        </ButtonGroup>
      </div>
      <div style={{ margin: '16px 0',
        width: '50vw' }}>
        <Subtitle>Inputs</Subtitle>
        <TextInput label="Text Input" id="text-input" placeholder="Placeholder" />
        <Textarea label="Textarea" id="textarea" placeholder="Placeholder" />
      </div>
      <div style={{ margin: '16px 0' }}>
        <Subtitle>Checkboxes</Subtitle>
        <Checkbox label="Checkbox 1" id="checkbox-1" value="1" />
        <Checkbox label="Checkbox 2" id="checkbox-2" value="2" />
      </div>
      <div style={{ margin: '16px 0' }}>
        <Subtitle>Radios</Subtitle>
        <Radio label="Radio 1" name="radio" />
        <Radio label="Radio 2" name="radio" />
      </div>
      <div style={{ margin: '16px 0' }}>
        <Subtitle>Chips (Checkbox)</Subtitle>
        <ChipGroup>
          <Chip label="Dinner" />
          <Chip label="Snack" color="primary" />
          <Chip label="Dessert" color="secondary" />
          <Chip label="Lunch" />
        </ChipGroup>
      </div>
      <div style={{ display: 'flex' }}>
        <Heart size={40} />
        <Heart size={40} color="primary" />
        <Heart size={40} color="secondary" />
        <Heart size={40} filled={true} color="default" />
        <Heart size={40} filled={true} color="primary" />
        <Heart size={40} filled={true} color="secondary" />
      </div>
      <h1>H1 Headline!!</h1>
      <h2>H2 Headline</h2>
      <h3>H3 Headline</h3>
      <h4>H4 Headline</h4>
      <h5>H5 Headline</h5>
      <h6>H6 Headline</h6>
    </Layout>
  );

}
